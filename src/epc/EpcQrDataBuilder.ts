import { EpcQrVersion, EpcQrCurrency } from './EpcQrConstants';
import { EpcQrData } from './EpcQrData';
import { EpcQrDataInstance } from './EpcQrDataInstance';
import { RemittanceInformation } from './RemittanceInformation';
import IBAN from 'iban';

export class EpcQrDataBuilder {
    private _bic?: string;
    private _beneficiaryIban?: string;
    private _beneficiaryName?: string;
    private _transferAmount?: string;
    private _purpose?: string;
    private _remittanceInformation?: RemittanceInformation;

    constructor() {}

    setBic(bic: string): this {
        if (bic.length > 11) {
            throw new Error('BIC must not exceed 11 characters.');
        }
        this._bic = bic;

        return this;
    }

    setBeneficiaryIban(iban: string): this {
        if (!IBAN.isValid(iban)) {
            throw new Error('The beneficiary\'s IBAN is not valid.');
        }
        this._beneficiaryIban = IBAN.printFormat(iban, '');

        return this;
    }

    setBeneficiaryName(name: string): this {
        if (name.length > 70) {
            throw new Error('The beneficiary\'s name must not exceed 70 characters.');
        }
        this._beneficiaryName = name;

        return this;
    }

    setTransferAmount(amount: number, currency: EpcQrCurrency): this {
        if (amount < 0.01) {
            throw new Error('The transfer amount must be larger than 0.01.');
        }
        if (amount > 999999999.99) {
            throw new Error('The transfer amount must be smaller than 999999999.99.');
        }
        this._transferAmount = `${currency}${amount.toFixed(2)}`;

        return this;
    }

    setPurpose(purpose: string): this {
        if (purpose.length > 4) {
            throw new Error('The purpose of the transfer must not exceed 4 characters.');
        }
        this._purpose = purpose;

        return this;
    }

    setStructuredRemittanceInformation(remittanceInfo: string): this {
        // TODO: validate structured remittance information
        if (remittanceInfo.length > 35) {
            throw new Error('The structured remittance information must not exceed 35 characters.');
        }

        this._remittanceInformation = {
            message: remittanceInfo,
            structured: true
        }

        return this;
    }

    setUnstructuredRemittanceInformation(remittanceInfo: string): this {
        if (remittanceInfo.length > 140) {
            throw new Error('The unstructured remittance information must not exceed 140 characters.');
        }

        this._remittanceInformation = {
            message: remittanceInfo,
            structured: false
        }

        return this;
    }

    buildV1(): EpcQrData {
        return new EpcQrDataInstance(EpcQrVersion.V1, this);
    }

    buildV2(): EpcQrData {
        return new EpcQrDataInstance(EpcQrVersion.V2, this);
    }

    get bic(): string | undefined {
        return this._bic;
    }

    get beneficiaryIban(): string | undefined {
        return this._beneficiaryIban;
    }

    get beneficiaryName(): string | undefined {
        return this._beneficiaryName;
    }

    get transferAmount(): string | undefined {
        return this._transferAmount;
    }

    get purpose(): string | undefined {
        return this._purpose;
    }

    get remittanceInformation(): RemittanceInformation | undefined {
        return this._remittanceInformation;
    }
}
