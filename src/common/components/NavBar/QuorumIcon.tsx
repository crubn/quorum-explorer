/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import Image from 'next/image';
import nbpLogo from '../../../assets/imgs/nbpLogo.png';

export const QuorumIcon = ({ size=60, ...rest }) => {

  return (

    <Image
      src={nbpLogo}
      alt="National Blockchain Project"
      width={size}
      height={size}
    />
  );
};
