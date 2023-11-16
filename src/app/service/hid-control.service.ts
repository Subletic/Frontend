import {Injectable, ViewChild} from '@angular/core';
import {AudioHandlerComponent} from '../audio-handler/audio-handler.component';

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

  @ViewChild('audioHandler') audioHandler!: AudioHandlerComponent;

  private HID_DEVICES: HidDetails[] = [
    {
      // Grundig foot control (USB)
      vendorId: 0x15d8,
      productId: 0x0024,
      usagePage: 0xffff,
      usage: 0x01
    }
  ];

  /**
   * Initializes the dictionary with default values.
   */
  constructor() {
    if (!('hid' in navigator)) {
      console.error('WebHID is not supported in this browser.');
      return;
    }
    this.configureDevices();
  }

  private async findAllowedDevices(): Promise<HidDevice[]> {
    const webhid = (navigator as any).hid;
    const allowedDevices: HidDevice[] = await webhid.getDevices();
    return allowedDevices.filter (allowedDevice =>
      this.HID_DEVICES.find (handlableDevice =>
        handlableDevice.vendorId === allowedDevice.vendorId
        && handlableDevice.productId === allowedDevice.productId) !== undefined);
  }

  private async configureDevices() {
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
        const valueMeanings: { [state: number]: string; } = {
            0: "stop last action",
            1: "fast-forward",
            2: "play",
            4: "rewind"
        };

        console.log(`pedal says: ${value} (meaning: ${valueMeanings[value]}`);
      });
    });
  }
}
