import React from "react";

interface TextNormalProps {
  className?: string;
  divClassName?: string;
  prop?: string;
}

export const TextNormal: React.FC<TextNormalProps> = ({
  className,
  divClassName,
  prop,
}) => (
  <div className={className}>
    <input
      type="text"
      placeholder={prop}
      className={divClassName}
    />
  </div>
);
