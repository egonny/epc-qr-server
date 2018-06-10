import { EpcQrData } from './EpcQrData';
import { EpcQrDataBuilder } from './EpcQrDataBuilder';
import { RemittanceInformation } from './RemittanceInformation';
import { EpcQrVersion, EpcQrCharacterSet } from './EpcQrConstants';

export class EpcQrDataInstance implements EpcQrData {
    private _version: EpcQrVersion;
    private _charset: EpcQrCharacterSet;
    private _beneficiaryIban: string;
    private _beneficiaryName: string;
    private _transferAmount: string;

    private _bic?: string;
    private _purpose?: string;
    private _remittanceInformation?: RemittanceInformation;

    constructor(version: EpcQrVersion, builder: EpcQrDataBuilder) {
        if (!(builder.beneficiaryIban && builder.beneficiaryName && builder.transferAmount)) {
            throw new Error('Transfer amount, beneficiary\'s name and beneficiary\'s IBAN must be defined.');
        }
        if (version === EpcQrVersion.V1 && !builder.bic) {
            throw new Error('The beneficiary\'s BIC must be defined.');
        }

        this._version = version;
        this._charset = EpcQrCharacterSet.UTF8;
        this._beneficiaryIban = builder.beneficiaryIban;
        this._beneficiaryName = builder.beneficiaryName;
        this._transferAmount = builder.transferAmount;
        
        this._bic = builder.bic;
        this._purpose = builder.purpose;
        this._remittanceInformation = builder.remittanceInformation;
    }

    get version(): EpcQrVersion {
        return this._version;
    }

    get characterSet(): EpcQrCharacterSet {
        return this._charset;
    }

    get beneficiaryIban(): string {
        return this._beneficiaryIban;
    }

    get beneficiaryName(): string {
        return this._beneficiaryName;
    }

    get transferAmount(): string {
        return this._transferAmount;
    }

    get bic(): string | undefined {
        return this._bic;
    }

    get purpose(): string | undefined {
        return this._purpose;
    }

    get remittanceInformation(): RemittanceInformation | undefined {
        return this._remittanceInformation;
    }

    private formatRemittanceInformation(): string {
        if (!this.remittanceInformation) {
            return '\n\n';
        } else if (this.remittanceInformation && this.remittanceInformation.structured) {
            return this.remittanceInformation.message + '\n\n';
        } else {
            return '\n' + this.remittanceInformation.message + '\n';
        }
    }

    toString(): string {
        return `BCD
${this.version}
${this.characterSet}
SCT
${this.bic || ''}
${this.beneficiaryName}
${this.beneficiaryIban}
${this.transferAmount}
${this.purpose || ''}
${this.formatRemittanceInformation()}
 
`;
    }
}
