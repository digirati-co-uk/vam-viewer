import React from 'react';

interface InfoButtonProps {
  bem: any;
  onClick: (args: any) => void;
  hidden: boolean;
}

interface InfoIconProps {
  onClick: (args: any) => void;
  className: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({
  onClick = () => {},
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={className}
    onClick={onClick}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
      fill="#fff"
    />
  </svg>
);

export const InfoButton: React.FC<InfoButtonProps> = ({
  bem,
  onClick,
  hidden,
}) => (
  <div className={bem.element('info').modifiers({ hidden })} onClick={onClick}>
    <InfoIcon className={bem.element('info-icon')} onClick={() => {}} />
  </div>
);
