import { Injectable } from '@angular/core';
import { ConsoleHideService } from './consoleHide.service';

interface HIDDeviceDetails extends HIDDeviceFilter {
  inputOffset: number;
}

/**
 * Service to request & configure access to external HID control devices (foot control, hand control, etc)
 */
@Injectable({
  providedIn: 'root',
})
export class HidControlService {
  // Devices we can handle
  private HID_DEVICES: HIDDeviceDetails[] = [
    {
      // Grundig foot control (USB)
      vendorId: 0x15d8,
      productId: 0x0024,
      usagePage: 0xffff,
      usage: 0x01,
      inputOffset: 0,
    },

    {
      // Olympus hand control
      vendorId: 0x07b4,
      productId: 0x026e,
      inputOffset: 2,
    },
  ];

  // The previous switch state, required for i.e. differenciating stop->play and play+ffwd->play
  private lastState = 0;

  /**
   * Does an initial check for WebHID support, issues one error at the start if WebHID is unsupported in this environment.
   */
  constructor(private consoleHideService: ConsoleHideService) {
    if (!this.isSupportedWebHID()) {
      console.error(
        'WebHID is not supported in this browser, you cannot make use of external control devices.',
      );
      return;
    }
  }

  /**
   * Check for WebHID support
   */
  private isSupportedWebHID(): boolean {
    return 'hid' in navigator;
  }

  /**
   * Find devices we've previously been granted access to, and filter out devices we can't actually handle
   */
  private async findAllowedDevices(): Promise<HIDDevice[]> {
    const allowedDevices: HIDDevice[] = await navigator.hid.getDevices();
    return allowedDevices.filter(
      (allowedDevice) =>
        this.HID_DEVICES.find(
          (handlableDevice) =>
            handlableDevice.vendorId === allowedDevice.vendorId &&
            handlableDevice.productId === allowedDevice.productId,
        ) !== undefined,
    );
  }

  /**
   * Check if there are devices we could handle, but don't yet have the permissions to,
   * and request access to them
   */
  private async checkForDevices(): Promise<void> {
    // get permitted devices we care about
    const alreadyAllowedDevices: HIDDevice[] = await this.findAllowedDevices();
    this.consoleHideService.hidLog(
      `We have been granted access to ${alreadyAllowedDevices.length} devices`,
    );

    // find out what devices we have yet to be granted permission to
    const unhandledDevices: HIDDeviceFilter[] = this.HID_DEVICES.filter(
      (potentialDevice) =>
        alreadyAllowedDevices.find(
          (allowedDevice) =>
            potentialDevice.vendorId === allowedDevice.vendorId &&
            potentialDevice.productId === allowedDevice.productId,
        ) === undefined,
    );
    this.consoleHideService.hidLog(
      `Of those device(s), we don't yet have permissions to access ${unhandledDevices.length} of them`,
    );
    if (unhandledDevices.length === 0) return;

    // try to request access to them
    try {
      await navigator.hid.requestDevice({
        filters: unhandledDevices,
      });
    } catch (e) {
      console.error('Unable to request device access');
    }
  }

  /**
   * Make a callback that will be run whenever an allowed & handlable device sends an input state
   */
  private makeCallbackDeviceInput(
    callbackPlay: () => void,
    callbackFastforward: () => void,
    callbackRewind: () => void,
    inputOffset: number,
  ): (ev: HIDInputReportEvent) => void {
    return (event) => {
      const { data } = event;

      const REWIND_BIT = 1 << 2;
      const PLAY_BIT = 1 << 1;
      const FASTFORWARD_BIT = 1 << 0;
      const value: number = data.getUint8(inputOffset);

      // decypher button states for printing
      let valueMeaning = 'stop';
      if (value > 0) {
        const meaningsSet: string[] = [];
        if ((value & REWIND_BIT) == REWIND_BIT) meaningsSet.push('rewind');
        if ((value & PLAY_BIT) == PLAY_BIT) meaningsSet.push('play');
        if ((value & FASTFORWARD_BIT) == FASTFORWARD_BIT) meaningsSet.push('fast-forward');
        valueMeaning = meaningsSet.toString();
      }
      this.consoleHideService.hidLog(`pedal says: ${value} (meaning: ${valueMeaning}`);

      // decide what to do, based on current & last button states
      switch (value) {
        // nothing pressed, stop
        case 0:
          if (this.lastState === PLAY_BIT) callbackPlay();
          break;

        // only play pressed
        case PLAY_BIT:
          if (this.lastState === 0) callbackPlay();
          break;

        // fast-forward pressed, with or without play
        case FASTFORWARD_BIT:
        case FASTFORWARD_BIT + PLAY_BIT:
          callbackFastforward();
          break;

        // rewind pressed, with or without play
        case REWIND_BIT:
        case REWIND_BIT + PLAY_BIT:
          callbackRewind();
          break;

        // anything else, no clue how to respond to it
        default:
          console.log("Don't know what to do in this state");
          break;
      }

      // save this state for following calls
      this.lastState = value;
    };
  }

  private getInputOffset(device: HIDDevice): number {
    const potentialDetails = this.HID_DEVICES.find(
      (potentialDetails) =>
        potentialDetails.vendorId === device.vendorId &&
        potentialDetails.productId === device.productId,
    );
    if (typeof potentialDetails === 'undefined') {
      console.warn(
        `Cannot get HID input offset for unknown device ${device.vendorId}:${device.productId}, defaulting to 0`,
      );
      return 0;
    }
    return potentialDetails.inputOffset;
  }

  /**
   * Find devices we can handle, request access to any new ones, and apply input callbacks
   */
  public async configureDevices(
    callbackPlay: () => void,
    callbackFastforward: () => void,
    callbackRewind: () => void,
  ) {
    if (!this.isSupportedWebHID()) return;

    await this.checkForDevices();

    const allowedDevices: HIDDevice[] = await this.findAllowedDevices();
    this.consoleHideService.hidLog('Currently allowed devices:');
    this.consoleHideService.hidData(allowedDevices);

    allowedDevices.forEach(async (allowedDevice) => {
      try {
        await allowedDevice.open();
      } catch (e) {
        console.log(
          `Failed to open device ${allowedDevice.vendorId}:${allowedDevice.productId}:`,
          (e as Error).message,
        );
        return;
      }

      allowedDevice.addEventListener(
        'inputreport',
        this.makeCallbackDeviceInput(
          callbackPlay,
          callbackFastforward,
          callbackRewind,
          this.getInputOffset(allowedDevice),
        ),
      );
    });
  }
}
