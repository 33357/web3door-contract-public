const SIGNER: {[chainId: number]: string} = {
  56: '0x15cAafa1072B7756045DC016E7765a1C11EaeA7e',
  97: '0x7010D2D15700948A71b3edD0f71448062b75d392',
};

export const Web3GasConfig = {
  signer: SIGNER,
  funder: '0x055023894dC22A52023d221cC9Cb2D2dA88fe20a',
  referShare: 5,
  funderShare: 5,
  shareBase: 100,
};
