import {Injectable} from '@angular/core';

interface HidDetails {
  vendorId: number;
  productId: number;
  usagePage: number;
  usage: number;
}

interface HidDevice extends HidDetails {
  open(): void;
  addEventListener(eventName: string, event: any): void;
}

/**
 * Service to request & configure access to external HID control devices (foot control, hand control, etc)
 */
@Injectable({
  providedIn: 'root'
})
export class HidControlService {

  private HID_DEVICES: HidDetails[] = [
    {
      // Grundig foot control (USB)
      vendorId: 0x15d8,
      productId: 0x0024,
      usagePage: 0xffff,
      usage: 0x01
    }
  ];

  private playFunc: () => void = () => null;
  private forFunc: () => void = () => null;
  private revFunc: () => void = () => null;

  private lastState: number = 0;

  /**
   * Initializes the dictionary with default values.
   */
  constructor() {
    if (!this.isSupportedWebHID()) {
      console.error('WebHID is not supported in this browser, you cannot make use of external control devices.');
      return;
    }
  }

  private isSupportedWebHID(): boolean {
    return ('hid' in navigator);
  }

  public registerFunctions(playFunc: () => void, forFunc: () => void, revFunc: () => void) {
    this.playFunc = playFunc;
    this.forFunc = forFunc;
    this.revFunc = revFunc;
  }

  private async findAllowedDevices(): Promise<HidDevice[]> {
    const webhid = (navigator as any).hid;
    const allowedDevices: HidDevice[] = await webhid.getDevices();
    return allowedDevices.filter (allowedDevice =>
      this.HID_DEVICES.find (handlableDevice =>
        handlableDevice.vendorId === allowedDevice.vendorId
        && handlableDevice.productId === allowedDevice.productId) !== undefined);
  }

  public async configureDevices() {
    if (!this.isSupportedWebHID()) return;
    const webhid = (navigator as any).hid;

    let allowedDevices: HidDevice[] = await this.findAllowedDevices();
    console.log("Currently allowed devices:");
    console.log(allowedDevices);

    const devicesNotYetAllowed: HidDetails[] = this.HID_DEVICES.filter (handlableDevice =>
      allowedDevices.find (allowedDevice =>
        handlableDevice.vendorId === allowedDevice.vendorId
        && handlableDevice.productId === allowedDevice.productId) === undefined);

    if (devicesNotYetAllowed.length > 0) {
      console.log("Devices we could additionally handle:");
      console.log(devicesNotYetAllowed);

      await webhid.requestDevice({
        filters:devicesNotYetAllowed
      });

      // get new list, in case more devices were allowed
      allowedDevices = await this.findAllowedDevices();
      console.log("Currently allowed devices:");
      console.log(allowedDevices);
    }

    allowedDevices.forEach (async allowedDevice => {
      try {
        await allowedDevice.open();
      } catch (e) {
        console.log(`Failed to open device ${allowedDevice.vendorId}:${allowedDevice.productId}:`, (e as Error).message);
        return;
      }

      allowedDevice.addEventListener("inputreport", (event: any) => {
        const { data } = event;

        const value: number = data.getUint8(0);

        // decypher button states for printing
        let valueMeaning: string = "stop";
        if (value > 0) {
          valueMeaning = "";
          let valueCopy: number = value;
          do {
            if (valueCopy >= 4) {
              valueMeaning += "rewind";
              valueCopy -= 4;
            } else if (valueCopy >= 2) {
              valueMeaning += "play";
              valueCopy -= 2;
            } else if (valueCopy >= 1) {
              valueMeaning += "fast-forward";
              valueCopy -= 1;
            }

            if (valueCopy > 0)
              valueMeaning += " + ";
          } while (valueCopy > 0);
        }
        console.log(`pedal says: ${value} (meaning: ${valueMeaning}`);

        // decide what to do, based on current & last button states
        switch (value) {
          // nothing pressed, stop
          case 0:
            if (this.lastState === 2)
              this.playFunc();
            break;

          // only play pressed
          case 2:
            if (this.lastState === 0)
              this.playFunc();
            break;

          // fast-forward pressed, with or without play
          case 1:
          case 3:
            this.forFunc();
            break;

          // rewind pressed, with or without play
          case 4:
          case 6:
            this.revFunc();
            break;

          // anything else, no clue how to respond to it
          default:
            console.log("Don't know what to do in this state");
            break;
        }

        // save this state for following calls
        this.lastState = value;
      });
    });
  }
}

