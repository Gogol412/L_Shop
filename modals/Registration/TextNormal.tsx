import React from "react";

interface TextNormalProps {
  className?: string;
  divClassName?: string;
  prop: string;
}

export const TextNormal: React.FC<TextNormalProps> = ({ className, divClassName, prop }) => {
  return (
    <div className={divClassName}>
      <input
        type="text"
        placeholder={prop}
        className={className}
      />
    </div>
  );
};