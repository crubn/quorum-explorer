/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { useColorMode, useColorModeValue } from "@chakra-ui/react";

export const QuorumIcon = ({ ...rest }) => {
  const { colorMode } = useColorMode();
  const lightMode = "gray.800";
  const darkMode = "white";
  const colorFill = useColorModeValue(lightMode, darkMode);

  return (
    <svg width="60" height="60" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="42.5" cy="42.5" r="42.5" fill="#ffffff" />
      <path d="M50.4682 45.7408C49.2122 45.7351 47.9972 45.2933 47.0306 44.4907C46.0639 43.6882 45.4056 42.5747 45.168 41.3403C44.8199 39.4734 44.3113 37.6645 43.3054 36.03C43.0048 35.5096 42.647 35.0244 42.2388 34.5835C40.8322 33.159 39.4754 31.6766 37.9415 30.3787C35.9075 28.5883 33.4229 27.389 30.7567 26.9103C29.5736 26.6811 28.5006 26.0637 27.7074 25.1558C26.9141 24.2479 26.4458 23.1012 26.3766 21.8971C26.3112 20.6305 26.6826 19.3799 27.4287 18.3547C28.1747 17.3295 29.2501 16.5921 30.4747 16.2659C31.1947 16.0836 31.9445 16.0508 32.6777 16.1696C33.4109 16.2884 34.112 16.5562 34.7378 16.9566C35.3636 17.3569 35.9008 17.8814 36.3163 18.4975C36.7319 19.1137 37.0169 19.8085 37.1539 20.5391C37.524 22.5195 38.052 24.4417 39.0601 26.2064C39.5343 27.078 40.1246 27.881 40.815 28.5934C41.9425 29.7135 42.9871 30.9221 44.2639 31.8846C46.2895 33.4141 48.5969 34.3019 51.0591 34.7999C52.3082 35.0516 53.4412 35.4802 54.3558 36.4068C55.1281 37.176 55.6523 38.1593 55.8606 39.2296C56.069 40.2999 55.952 41.4082 55.5248 42.4114C54.84 44.1172 52.9056 45.8099 50.4682 45.7408Z" fill="#0170E0" />
      <path d="M78.0026 42.0879C78.0909 44.7923 75.9297 47.213 73.2743 47.5171C71.8759 47.7021 70.4604 47.3364 69.3262 46.497C68.192 45.6577 67.4278 44.4103 67.1948 43.0179C66.8466 40.9518 66.2028 38.9965 64.9841 37.2649C64.8624 37.0692 64.7246 36.884 64.5721 36.7112C62.6569 34.7529 60.8521 32.6703 58.5756 31.1021C56.9555 29.9509 55.1028 29.1692 53.1481 28.812C50.7938 28.4082 49.2158 27.0558 48.6051 24.7268C47.6544 21.0981 50.6528 17.6021 54.3835 17.9313C56.8706 18.1497 58.8851 20.1439 59.3134 22.7024C59.7416 25.2609 60.5928 27.7778 62.3532 29.7884C64.315 32.0205 66.3547 34.1944 69.1927 35.3864C70.6138 35.992 72.0962 36.4418 73.6141 36.7279C76.2035 37.2034 78.0964 39.6429 78.0026 42.0879Z" fill="#0170E0" />
      <path d="M11.3971 36.4519C12.6834 36.4357 13.934 36.8759 14.927 37.6946C15.92 38.5133 16.5912 39.6574 16.8216 40.9242C17.1107 42.7247 17.6697 44.4712 18.4797 46.1047C19.0383 47.2197 19.7747 48.236 20.6601 49.1139C21.6384 50.0599 22.5282 51.0942 23.5865 51.9517C25.695 53.6608 28.1434 54.6207 30.7714 55.1518C32.0177 55.4033 33.1619 55.8294 34.0517 56.7835C35.4886 58.321 35.9861 60.1026 35.392 62.1354C35.1422 63.0837 34.6313 63.9428 33.9175 64.6146C33.2037 65.2865 32.3157 65.7443 31.3546 65.9357C30.6467 66.1049 29.9119 66.1288 29.1946 66.006C28.4772 65.8831 27.7922 65.616 27.1808 65.2207C26.5695 64.8255 26.0445 64.3103 25.6376 63.7064C25.2307 63.1024 24.9504 62.4222 24.8135 61.7067C24.4989 60.1219 24.1087 58.5646 23.3514 57.1183C22.8397 56.1091 22.1698 55.1884 21.3672 54.3912C20.0767 53.1411 18.8802 51.7914 17.4992 50.6435C15.4293 48.9314 13.1164 47.7146 10.4249 47.2722C9.21074 47.0543 8.10854 46.4248 7.30341 45.4895C6.49827 44.5542 6.03924 43.3701 6.00341 42.136C5.95915 40.8787 6.34636 39.6442 7.10062 38.6377C7.85487 37.6313 8.9307 36.9137 10.1491 36.6043C10.5557 36.4941 10.9759 36.4427 11.3971 36.4519Z" fill="#0170E0" />
      <path d="M51.1789 67.2175C48.7525 67.3116 46.282 65.2952 45.8537 62.7508C45.5869 60.8965 44.9628 59.1117 44.0161 57.4956C43.6893 56.9377 43.2999 56.419 42.8555 55.9495C41.4737 54.5665 40.1534 53.1091 38.6523 51.845C36.7786 50.2629 34.6896 49.0793 32.2742 48.5426C31.9596 48.4736 31.6414 48.4293 31.3262 48.3574C30.3639 48.1491 29.4753 47.6854 28.7537 47.0149C28.032 46.3445 27.504 45.492 27.2249 44.5469C26.9459 43.6019 26.9261 42.5991 27.1677 41.6437C27.4092 40.6884 27.9032 39.8157 28.5978 39.1172C29.2924 38.4188 30.162 37.9203 31.1154 37.6741C32.0688 37.4279 33.0708 37.4431 34.0164 37.718C34.9619 37.9929 35.8161 38.5174 36.4893 39.2365C37.1625 39.9556 37.6299 40.8429 37.8426 41.8051C38.1387 43.188 38.4118 44.5986 38.9478 45.929C39.595 47.6131 40.5936 49.1397 41.877 50.4069C42.8222 51.3169 43.6843 52.3181 44.7124 53.1422C46.7158 54.7436 49.0344 55.6564 51.5103 56.2234C52.1918 56.3346 52.859 56.52 53.5001 56.7766C54.5518 57.2575 55.4239 58.06 55.9909 59.0686C56.5579 60.0772 56.7906 61.2399 56.6554 62.3892C56.5202 63.5386 56.0242 64.6153 55.2387 65.4646C54.4532 66.3138 53.4187 66.8917 52.2841 67.1151C51.918 67.1705 51.549 67.2047 51.1789 67.2175Z" fill="#0170E0" />
      <path d="M42.0714 77.9956C40.995 77.9845 39.946 77.6541 39.0573 77.0462C38.1685 76.4383 37.4799 75.5802 37.0785 74.5805C36.6771 73.5808 36.581 72.4844 36.8024 71.43C37.0238 70.3756 37.5527 69.4106 38.3221 68.6572C39.0916 67.9037 40.0671 67.3956 41.1251 67.1972C42.1832 66.9987 43.2763 67.1189 44.2661 67.5424C45.256 67.9659 46.098 68.6737 46.6858 69.5764C47.2736 70.479 47.5806 71.5358 47.5681 72.6132C47.5509 75.4786 45.0944 78.1228 42.0714 77.9956Z" fill="black" />
      <path d="M62.4356 57.6522C61.3586 57.6433 60.3084 57.315 59.418 56.7087C58.5275 56.1023 57.8367 55.2453 57.4331 54.2459C57.0294 53.2465 56.931 52.1498 57.1503 51.0944C57.3696 50.039 57.8967 49.0725 58.665 48.3171C59.4333 47.5617 60.4082 47.0513 61.4664 46.8506C62.5246 46.6499 63.6185 46.7678 64.6097 47.1895C65.6008 47.6112 66.4448 48.3177 67.0347 49.2195C67.6246 50.1214 67.9339 51.1782 67.9236 52.2561C67.9071 55.1191 65.4393 57.7794 62.4356 57.6522Z" fill="black" />
      <path d="M41.9613 6.00024C43.2176 6.01384 44.4303 6.4628 45.3931 7.27069C46.3558 8.07858 47.0091 9.19545 47.2416 10.4312C47.4741 11.6669 47.2715 12.9451 46.6683 14.0481C46.0651 15.1512 45.0986 16.0109 43.9334 16.4809C42.7681 16.951 41.476 17.0023 40.2772 16.6261C39.0784 16.2499 38.0469 15.4695 37.3583 14.4177C36.6698 13.366 36.3667 12.1078 36.5007 10.8576C36.6347 9.6073 37.1975 8.44215 38.0932 7.56048C39.1251 6.54791 40.5163 5.98674 41.9613 6.00024Z" fill="black" />
      <path d="M16.2561 31.6274C16.2715 30.3678 16.7227 29.1524 17.5329 28.1884C18.3432 27.2244 19.4623 26.5713 20.6996 26.3404C21.9369 26.1095 23.216 26.3151 24.3189 26.9221C25.4218 27.5292 26.2803 28.5001 26.7482 29.6696C27.216 30.8391 27.2644 32.1348 26.8849 33.3359C26.5055 34.537 25.7217 35.5694 24.6671 36.257C23.6125 36.9447 22.3523 37.2452 21.1012 37.1073C19.8501 36.9694 18.6855 36.4016 17.8057 35.5007C16.7972 34.4659 16.2399 33.073 16.2561 31.6274Z" fill="black" />
    </svg>

  );
};
