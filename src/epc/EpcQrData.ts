import { EpcQrDataBuilder } from './EpcQrDataBuilder';
import { RemittanceInformation } from './RemittanceInformation';
import { EpcQrVersion, EpcQrCharacterSet } from './EpcQrConstants';

export interface EpcQrData {
    version: EpcQrVersion;
    characterSet: EpcQrCharacterSet;
    beneficiaryIban: string;
    beneficiaryName: string;
    transferAmount: string;
    
    bic?: string;
    purpose?: string;
    remittanceInformation?: RemittanceInformation;

    toString(): string;
}