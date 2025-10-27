import React from "react";
import ColorPicker from "./color-picker";
import { SliderWithInput } from "./slider-with-input";

interface ShadowControlProps {
  shadowColor: string;
  shadowOpacity: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  onChange: (key: string, value: string | number) => void;
}

const ShadowControl: React.FC<ShadowControlProps> = ({
  shadowColor,
  shadowOpacity,
  shadowBlur,
  shadowSpread,
  shadowOffsetX,
  shadowOffsetY,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <ColorPicker
          color={shadowColor}
          label="Shadow Color"
          onChange={(color) => onChange("shadow-color", color)}
        />
      </div>

      <div>
        <SliderWithInput
          label="Shadow Opacity"
          max={1}
          min={0}
          onChange={(value) => onChange("shadow-opacity", value)}
          step={0.01}
          unit=""
          value={shadowOpacity}
        />
      </div>

      <div>
        <SliderWithInput
          label="Blur Radius"
          max={50}
          min={0}
          onChange={(value) => onChange("shadow-blur", value)}
          step={0.5}
          unit="px"
          value={shadowBlur}
        />
      </div>

      <div>
        <SliderWithInput
          label="Spread"
          max={50}
          min={-50}
          onChange={(value) => onChange("shadow-spread", value)}
          step={0.5}
          unit="px"
          value={shadowSpread}
        />
      </div>

      <div>
        <SliderWithInput
          label="Offset X"
          max={50}
          min={-50}
          onChange={(value) => onChange("shadow-offset-x", value)}
          step={0.5}
          unit="px"
          value={shadowOffsetX}
        />
      </div>

      <div>
        <SliderWithInput
          label="Offset Y"
          max={50}
          min={-50}
          onChange={(value) => onChange("shadow-offset-y", value)}
          step={0.5}
          unit="px"
          value={shadowOffsetY}
        />
      </div>
    </div>
  );
};

export default ShadowControl;
