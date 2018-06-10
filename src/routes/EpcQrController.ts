import { EpcQrCurrency } from './../epc/EpcQrConstants';
import { EpcQrDataBuilder } from './../epc/EpcQrDataBuilder';
import { EpcQrData } from './../epc/EpcQrData';
import { Router } from 'express';
import qrcode from 'qrcode';

const router = Router();

const getEpcQrData = (iban?: string, name?: string, amount?: string, bic?: string, purpose?: string,
    message?: string): EpcQrData => {
    if (!(iban !== undefined && name !== undefined && amount !== undefined)) {
        throw new Error('Not all required arguments have been set.')
    }

    const builder = new EpcQrDataBuilder()
        .setBeneficiaryIban(iban)
        .setBeneficiaryName(name)
        .setTransferAmount(Number(amount), EpcQrCurrency.EURO)
        .setBic(bic || '')
        .setPurpose(purpose || '')
        .setUnstructuredRemittanceInformation(message || '');

    return builder.buildV2();
}

router.get('/qr', (req, res) => {
    let {
        iban,
        name,
        amount,
        bic,
        purpose,
        message
    } = req.query;

    try {
        const data = getEpcQrData(iban, name, amount, bic, purpose, message);
        res.type('png');
        return qrcode.toFileStream(res, data.toString());
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

export const EpcQrController: Router = router;
export default EpcQrController;