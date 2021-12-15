import { Orientation } from '../enum/orientation';

export class LawnMower {
  private _position: { x: number; y: number };
  private _orientation: Orientation;
  private readonly _instructionSequence: string;

  constructor(
    position: { x: number; y: number },
    orientation: Orientation,
    instructionSequence: string,
  ) {
    this._position = position;
    this._orientation = orientation;
    this._instructionSequence = instructionSequence;
  }

  public get position(): { x: number; y: number } {
    return this._position;
  }

  public set position(value: { x: number; y: number }) {
    this._position = value;
  }

  public get orientation(): Orientation {
    return this._orientation;
  }

  public set orientation(value: Orientation) {
    this._orientation = value;
  }

  public get instructionSequence(): string {
    return this._instructionSequence;
  }
}
