export const generarHtmlCorreo = (nombreSolicitante, puestoDelSolicitante, motivoVacante, puestoSolicitado, notificarRh, url) => {
    return `
    <!DOCTYPE html
            PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
            xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <link href="https://fonts.googleapis.com/css?family=Gorditas" rel="stylesheet">
            <meta name="x-apple-disable-message-reformatting">
            <meta name="viewport" content="initial-scale=1.0">
            <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if !mso]><!-->
            <meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
            <title>Gruver</title>
            <style type="text/css">
                .main_container {
                    max-width: 740px;
                    height: 100%;
                    margin: 10px auto 0 auto;
                    background-color: #fff
                }
        
                .in_container {
                    background: #fafafa
                }
        
                table {
                    border-collapse: collapse
                }
        
                img,
                a img {
                    border: 0;
                    height: auto;
                    outline: 0;
                    text-decoration: none
                }
        
                body {
                    height: 100% !important;
                    margin: 0 auto !important;
                    padding: 0;
                    width: 100% !important
                }
        
                img {
                    -ms-interpolation-mode: bicubic
                }
        
                #outlook a {
                    padding: 0
                }
        
                table {
                    mso-table-lspace: 0;
                    mso-table-rspace: 0
                }
        
                .ReadMsgBody {
                    width: 100%
                }
        
                .ExternalClass {
                    width: 100%
                }
        
                p,
                a,
                td {
                    mso-line-height-rule: exactly
                }
        
                p,
                a,
                td,
                body,
                table {
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%
                }
        
                .ExternalClass,
                .ExternalClass p,
                .ExternalClass td,
                .ExternalClass div,
                .ExternalClass span,
                .ExternalClass font {
                    line-height: 100%
                }
                * [href]:not([style]) {
                    color: inherit !important;
                    text-decoration: none !important
                }
        
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important
                }
        
                @media screen and (max-width:480px) {
                    .mw100 {
                        max-width: 100% !important
                    }
        
                    .mw50 {
                        max-width: 49% !important
                    }
        
                    .mw227 {
                        max-width: 227px !important
                    }
        
                    .mw55 {
                        max-width: 55% !important
                    }
        
                    .mw70 {
                        max-width: 68% !important
                    }
        
                    .mw90 {
                        max-width: 90% !important
                    }
        
                    .mw95 {
                        max-width: 95% !important
                    }
        
                    .mw93 {
                        max-width: 93% !important
                    }
        
                    .mw50 {
                        max-width: 49% !important
                    }
        
                    .mw45 {
                        max-width: 45% !important
                    }
        
                    .mw40 {
                        max-width: 40% !important
                    }
        
                    .mw43 {
                        max-width: 43% !important
                    }
        
                    .mw60 {
                        max-width: 60% !important
                    }
        
                    .mw30 {
                        max-width: 30% !important
                    }
        
                    .mw80 {
                        max-width: 80% !important
                    }
        
                    .mw85 {
                        max-width: 85% !important
                    }
        
                    .mw70 {
                        max-width: 70% !important
                    }
        
                    .mw20 {
                        max-width: 20% !important
                    }
        
                    .mw33 {
                        max-width: 33% !important
                    }
        
                    .mw40 {
                        max-width: 40% !important
                    }
        
                    .mw75 {
                        max-width: 75% !important
                    }
        
                    .w100 {
                        width: 100% !important
                    }
        
                    .w92 {
                        width: 92% !important
                    }
        
                    .w90 {
                        width: 90% !important
                    }
        
                    .w98 {
                        width: 98% !important
                    }
        
                    .w95 {
                        width: 95% !important
                    }
        
                    .w80 {
                        width: 80% !important
                    }
        
                    .w85 {
                        width: 85% !important
                    }
        
                    .mbl-center {
                        margin: 0 auto !important;
                        float: none !important
                    }
        
                    .txtcntr {
                        text-align: center !important
                    }
        
                    .txtlt {
                        text-align: left !important
                    }
        
                    .noPadLR {
                        padding-left: 0 !important;
                        padding-right: 0 !important
                    }
        
                    .mlpadding {
                        padding-left: 20px !important
                    }
        
                    .mblPct {
                        font-size: 120px !important;
                        line-height: 120px !important
                    }
        
                    .mblRise {
                        font-size: 60px !important;
                        line-height: 0 !important;
                        vertical-align: 35px !important
                    }
        
                    .mblHL {
                        font-size: 34px !important;
                        line-height: 55px !important
                    }
        
                    table[class=center],
                    td[class=center] {
                        width: 100% !important;
                        height: auto !important;
                        text-align: center !important;
                        padding-left: 0 !important;
                        padding-right: 0 !important
                    }
        
                    .hide {
                        display: none !important
                    }
        
                    div[class=mobilecontent],
                    .mobilecontent {
                        display: block !important;
                        max-height: none !important
                    }
        
                    .hauto {
                        height: auto !important
                    }
        
                    .mobileInlineBlock {
                        display: inline-block !important
                    }
                }
        
                @media screen {
                    @font-face {
                        font-family: 'Gordita';
                        font-weight: normal;
                        font-style: normal;
                        src: url('https://fonts.luna1.co/gordita/hinted/hinted-Gordita-Regular.woff2') format('woff2')
                    }
                }
        
                @media screen {
                    @font-face {
                        font-family: 'Gordita';
                        font-weight: 300;
                        font-style: normal;
                        src: url('https://fonts.luna1.co/gordita/hinted/hinted-Gordita-Light.woff2') format('woff2')
                    }
                }
        
                @media screen {
                    @font-face {
                        font-family: 'Gordita';
                        font-weight: 500;
                        font-style: normal;
                        src: url('https://fonts.luna1.co/gordita/hinted/hinted-Gordita-Medium.woff2') format('woff2')
                    }
                }
            </style>
            <!--[if (mso)|(mso 16)]><style type="text/css">body,table,td,a,span{font-family:Helvetica,Arial,sans-serif!important}a{text-decoration:none}</style><![endif]--><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]-->
            <style type="text/css"> </style>
            <style type="text/css"> </style>
        </head>
        
        <bodyW>
            <table cellpadding="0" cellspacing="0" border="0"
                style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; width: 100%; background-color: #ffffff;"
                width="100%" bgcolor="#ffffff">
                <tbody>
                    <tr>
                        <td
                            style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-size: 0;">
                        </td>
                        <td align="center" valign="top"
                            style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-bottom: 40px; width: 600px; background-color: #ffffff;"
                            width="600" bgcolor="#ffffff"><!-- UPDATE PREVIEW TEXT HERE -->
                            <div style="display: none; max-height: 0px; overflow: hidden;">
                                &nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;
                            </div> <!-- /UPDATE PREVIEW TEXT HERE --><!-- VIEW_IN_BROWSER_SNIPPET -->
                            <table cellpadding="0" cellspacing="0" border="0"
                                style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; width: 100%; max-width: 600px;"
                                width="100%"><!-- row 1 -->
                                <tbody>
                                    <tr>
                                        <td align="center"
                                            style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                                            <!--[if (gte mso 9)|(IE)]><table border="0" cellspacing="0" cellpadding="0" width="600"><tr><td align="center"><!--[endif]-->
                                            <table cellpadding="0" cellspacing="0" border="0"
                                                style="width:100%;background-color:#ffffff; background:#ffffff"
                                                bgcolor="#ffffff" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td align="center">
                                                            <table cellpadding="0" cellspacing="0" border="0"
                                                                style="width:100%;" class="mw90">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="right"
                                                                            style="padding-top:60px; text-align: right; font-family:'Gordita',Helvetica,Arial, sans-serif !important; font-size:10px;line-height:16px;font-weight:normal; font-style: normal; color:#6F7782; text-decoration: underline;">
                                                                            <a style="color:#6F7782; text-decoration: underline;"
                                                                                href="">
                                                                                Ver en el navegador </a>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table> <!-- LOGO -->
                                            <table cellpadding="0" cellspacing="0" border="0"
                                                style="width:100%;background-color:#ffffff; background:#ffffff"
                                                bgcolor="#ffffff">
                                                <tbody>
                                                    <tr>
                                                        <td align="center">
                                                            <table cellpadding="0" cellspacing="0" border="0"
                                                                style="width:100%;" class="mw90">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="left" style="padding:40px 0 40px;"><a
                                                                                href=""><img
                                                                                    alt="Asana" width="150" border="0"
                                                                                    style="display:block;outline:0;border:0;padding:0;max-width:150px; height:auto; width:150px;"
                                                                                    height="30"
                                                                                    src="http://www.gruver.mx/wp-content/uploads/2022/06/logogruver2022.png"></a>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table> <!--HEADLINE_3-->
                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" align="center"
                                                bgcolor="#ffffff"
                                                style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #ffffff;">
                                                <tbody>
                                                    <tr>
                                                        <td align="center"
                                                            style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%"
                                                                class="mw90"
                                                                style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="left"
                                                                            style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-bottom: 8px; text-align: left; font-size: 32px; line-height: 42px; font-weight: 400; font-style: normal; color: #151B26; font-family: 'Gordita',Helvetica,Arial, sans-serif !important;">
                                                                            Buen dia, el colaborador ${nombreSolicitante} </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" align="center"
                                                bgcolor="#ffffff"
                                                style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #ffffff;">
                                                <tbody>
                                                    <tr>
                                                        <td align="center"
                                                            style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%"
                                                                class="mw90"
                                                                style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="left"
                                                                            style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-bottom: 40px; text-align: left; font-size: 18px; line-height: 28px; font-weight: 400; font-style: normal; color: #273240; font-family: 'Gordita',Helvetica,Arial, sans-serif !important;">
                                                                            con puesto
                
                        <strong>${puestoDelSolicitante}</strong> levanto una requisición para solicitar una vacante
                
                        con motivo de <strong>${motivoVacante}</strong> el puesto solicitado es <strong>${puestoSolicitado}</strong>,
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table> <!-- /END HEADLINE_3--> <!-- HERO_IMAGE -->
                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" align="center"
                                                bgcolor="#ffffff"
                                                style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #ffffff;">
                                                <tbody>
                                                    <tr>
                                                        <td align="center"
                                                            style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-bottom: 40px;">
                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%"
                                                                class="mw90"
                                                                style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="left"
                                                                            style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; text-align: left; font-size: 16px; line-height: 30px; font-weight: 400; font-style: normal; color: #273240; font-family: 'Gordita',Helvetica,Arial, sans-serif !important;">
                                                                            Para ver la requisición dar click en el siguiente botón
                                                                        o ir directo portal, en el siguiente enlace: <a style="color:#1052A0;"href="https://www.gruver.com.mx/portal_rh/#/">ir al portal de rh</a> </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table> <!-- /END BODY_COPY--> <!-- LEFT ALIGNED PURPLE CTA -->
                                            <table border="0" cellspacing="0" cellpadding="0" width="100%" class="mktoModule"
                                                id="cta2" mktoname="CTA 2"
                                                style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                                                <tbody>
                                                    <tr>
                                                        <td align="center"
                                                            style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%"
                                                                class="mw90"
                                                                style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="left"
                                                                            style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-bottom: 40px;">
                                                                            <table border="0" cellspacing="0" cellpadding="0"
                                                                                style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #1052A0; border-radius: 2px; border: #1052A0;"
                                                                                class="cta-teal" bgcolor="#796EFF">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="left" height="48"
                                                                                            style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                                                                                            <a style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; border-radius: 2px; display: inline-block; border: 2px solid #1052A0; padding: 10px 32px; font-size: 16px; line-height: 26px; font-style: normal; font-weight: 500; color: #ffffff; text-decoration: none; font-family: 'Gordita',Helvetica,Arial, sans-serif !important;"
                                                                                                target="_blank"
                                                                                                href="${url}">Ver
                                                                                                requisición</a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr> <!--cta-->
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table> <!-- /END LEFT ALIGNED PURPLE CTA --> <!-- DIVIDER HORIZONTAL LINE -->
                                            <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0"
                                                style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; max-width: 600px; width: 100%;">
                                                <tbody>
                                                    <tr>
                                                        <td align="center"
                                                            style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding: 16px 0;">
                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%"
                                                                class="mw90"
                                                                style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="100%" align="center" valign="top"
                                                                            style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; width: 100%; max-width: 600px; line-height: 0px; text-align: center; color: #D9DDDF; border-bottom: 1px solid #CBD4DB;">
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table> 
                                            <table align="center" cellpadding="0" cellspacing="0" border="0" valign="top"
                                                style="width:100%;">
                                                <tbody>
                                                    <tr>
                                                        <td align="center" style="padding-top: 40px">
                                                            <table cellpadding="0" cellspacing="0" border="0"
                                                                style="width:100%;" class="mw90">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding-bottom: 40px; text-align: left; font-family:'Gordita',Helvetica,Arial, sans-serif !important; font-size:10px;line-height:16px;font-weight:400; font-style: normal; color:#273240">
                                                                            Este email se envió a ${notificarRh} Para
                                                                            obtener más información acerca de la manera en que
                                                                            procesamos los datos, de las requisiciones <a
                                                                                style="text-decoration:underline;color: #646F79;"
                                                                                target="_blank"
                                                                                href="https://connect.asana.com/u/click?_t=8cb45ebcfb7c4c8189af4a5ff6ca1a98&amp;_m=c59365ff040c428cb7b4a91e26025db0&amp;_e=dtcDbgzWh4FhBp59pTxADxH-U3hsxxucX8E4A493bxDFzgt74idkAxi4khaYDlVkg6SKGoRgmrWAA3FHq8PHQ5b6DexcATaWp9XNdfkNqk1WNAL7Vd7-N0yEdXkMzfAnr9yaTNKQ1RqlEjd1fUhGG5Mannq0cTt-zx_VUTnhhgnuZi3szRM5huV0UwYDBNChDE6lUMnPXJb0HGvStE9b3wHQ8mrVa9lAiMsBBCgKKHTRcHv68klBBwQXCuWmzCxfVBpsr4C3oxq7vnlyis5qzgd_cH9PPS4_RglAhW3UFFI%3D">Kebijakan
                                                                                Privasi</a>.<br> <br> Asana -&nbsp;633 Folsom
                                                                            Street, San Francisco, CA 94107</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;"
                                                valign="top">
                                                <tbody>
                                                    <tr>
                                                        <td align="center">
                                                            <table border="0" cellpadding="0" cellspacing="0" class="mw90"
                                                                style="width:100%;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="left"
                                                                            style="font-size:0;padding-bottom:32px; background-color:#ffffff;">
                                                                            <table cellpadding="0" cellspacing="0" border="0"
                                                                                width="234" style="width: 234px;">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center"
                                                                                            style="padding:0 9px 0 0;"><a
                                                                                                href="https://connect.asana.com/u/click?_t=8cb45ebcfb7c4c8189af4a5ff6ca1a98&amp;_m=c59365ff040c428cb7b4a91e26025db0&amp;_e=dtcDbgzWh4FhBp59pTxAD615rE7pvYA3vFdwH7jTv0cs4GN89ov9SkTPKBClgOAYWoVWPuWNLPO1NFrEPNWcuBegze8PY-ThWI2CIyP1T0hGofcKi8ephndymaL2FI9puOyzpbjIrTAFWc79JW-OBgZzajPTkuqkhV2g2DSPbfrkIH3ADQiXM9I4QvKlFGMaqEYQvr9pbfLqZC4s3TrSSv29iEFNdR_PbkEi-Wf_Voosd1riPN6cBlX5dSIuiILFg_DEqDT8-6rsJq62utkvv9BXvKQu5z8F8CmSO4iwfmveMWkwe0NzEFg09T1y9tYn"><img
                                                                                                    width="32"
                                                                                                    style="width: 32px;"
                                                                                                    class="imglink"
                                                                                                    alt="Twitter"
                                                                                                    src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/669d5713-9b6a-46bb-bd7e-c542cff6dd6a/8cb45ebcfb7c4c8189af4a5ff6ca1a98/twitter_icon-circle.png"></a>
                                                                                        </td>
                                                                                        <td align="center"
                                                                                            style="padding:0 9px 0 9px;"><a
                                                                                                href="https://connect.asana.com/u/click?_t=8cb45ebcfb7c4c8189af4a5ff6ca1a98&amp;_m=c59365ff040c428cb7b4a91e26025db0&amp;_e=dtcDbgzWh4FhBp59pTxAD2ijbZYzdwXRNSsE-uhDfKfKE_2HnbCN_M9WqW2YgAx3p38AxsvTlRJ9tTzquNpZEkyfsXm0wgWEdj6wW3YKZwsnOMI1b0wroTr9R8syBIiAh6_tPIZZ_HYOJ4Bo4ov4P7hhLu9zvKFWznK9tJC6Shc33s-cpsUxfLSf9RHJIwCQ5VqzYnVMyDVmTwJRuxizmePYGnUsywc6yOk1lA1SPjuJpmRUF97Gv6wd4f1mDwTtyAYZhfCKusncPaXRyaeMi2iDbniIMVmHIf0jm6JQH9_rCJL_jYGvQNMPp8KmHOC5"><img
                                                                                                    width="32"
                                                                                                    style="width: 32px;"
                                                                                                    class="imglink" alt=""
                                                                                                    src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/669d5713-9b6a-46bb-bd7e-c542cff6dd6a/8cb45ebcfb7c4c8189af4a5ff6ca1a98/linkedin_icon-circle_1.png"></a>
                                                                                        </td>
                                                                                        <td align="center"
                                                                                            style="padding:0 9px 0 9px;"><a
                                                                                                href="https://connect.asana.com/u/click?_t=8cb45ebcfb7c4c8189af4a5ff6ca1a98&amp;_m=c59365ff040c428cb7b4a91e26025db0&amp;_e=dtcDbgzWh4FhBp59pTxAD6XjEI0ElP4AbAZNXizFt5ugHARLCcIID_I_1safmECa4eq9qHimof7sfrsKbjGBq2BNo1C4hrEwFiiHjQWgLD73dSRupR-ByBVer7ejwj0NAG7bCl99iOUQcDJctLVYcO7qj2ABPD1cDyMbnoTtkzgSSb-vSyiLvcMSwL5CrcjRgMjXsL-s-Z8EyB3xEXlibVrhIv5tdvSeNETlw7vHIiwn4YOsN1US3dwHH8Mw6mxB6CDeJBEOnw0UKMdHr2zDx8JSXmv8LU24l8sfHUiRJBM%3D"><img
                                                                                                    width="32"
                                                                                                    style="width: 32px;"
                                                                                                    class="imglink"
                                                                                                    alt="Instagram"
                                                                                                    src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/669d5713-9b6a-46bb-bd7e-c542cff6dd6a/8cb45ebcfb7c4c8189af4a5ff6ca1a98/instagram_icon-circle_1.png"></a>
                                                                                        </td>
                                                                                        <td align="center"
                                                                                            style="padding:0 9px 0 9px;"><a
                                                                                                href="https://connect.asana.com/u/click?_t=8cb45ebcfb7c4c8189af4a5ff6ca1a98&amp;_m=c59365ff040c428cb7b4a91e26025db0&amp;_e=dtcDbgzWh4FhBp59pTxAD14bCGvGmBOCOauEPJO4b2kblI8dflBURTDQ3J2wIxb2CvDQU5rD_pW0Ve0Legmo27JNoQ6IIjYfiqX50Vkz_-HiSAhxSlCfQM8w1gM-0YQoWLl47yyC53FeLclOE01qgdd1vStH5kuFQU45Y9EpMs8UPUOEEqhmHUJipeY7GibTeD1BAofE8x_ID0lhwvFhaNOv6Lze8OLrTKmCBAF5bbidmhUNduo56JF5AJnUu24ENin8fbCqNtgxtO8F6aRIIah8NOU2Mo8wGHgl4UNTLog%3D"><img
                                                                                                    width="32"
                                                                                                    style="width: 32px;"
                                                                                                    class="imglink" alt=""
                                                                                                    src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/669d5713-9b6a-46bb-bd7e-c542cff6dd6a/8cb45ebcfb7c4c8189af4a5ff6ca1a98/facebook_icon-circle_1.png"></a>
                                                                                        </td>
                                                                                        <td align="center"
                                                                                            style="padding:0 0 0 9px;"><a
                                                                                                href="https://connect.asana.com/u/click?_t=8cb45ebcfb7c4c8189af4a5ff6ca1a98&amp;_m=c59365ff040c428cb7b4a91e26025db0&amp;_e=dtcDbgzWh4FhBp59pTxAD2kAxev8vVeeYEXM5SV0JkKaoM7XmLjpiFF3TtHFvEGMPFNhilNeWUd9lyPSTq2TRMkxaKf4PR3t_J5Td5OKzHyn1DDN9aD1q32wTv4VadS5yuocLASCINdHkrMg29Fl7_dUX-7jIUqKib2OXAoQX9dl-cq7WJX2juRpMgzvqTiMiaqZesU6XXoDBMoZ19nsQugRPcI-QIvMtjl_3qdg0jGB5nUMN7kCw0RL58fyfQvsjN3hq95lyOLyqqto7XxUd0aeI6ZXkvA2tx4Jy7G-t8DVHszQQS1qa7yEXzzRktzTbIOnvFnyEv_UW_OIhaQdnQ%3D%3D"><img
                                                                                                    width="32"
                                                                                                    style="width: 32px;"
                                                                                                    class="imglink" alt=""
                                                                                                    src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/669d5713-9b6a-46bb-bd7e-c542cff6dd6a/8cb45ebcfb7c4c8189af4a5ff6ca1a98/youtube_icon-circle_1.png"></a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table> <!-- /END OF FOOTER--> <!-- /END ALL CONTENT MODULES-->
                                            <!--[if (gte mso 9)|(IE)]></td></tr></table><!--[endif]-->
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td
                            style="mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-size: 0;">
                        </td>
                    </tr>
                </tbody>
            </table>
            <img border="0" width="1" height="1" alt=""
                src="http://post.spmailtechnol.com/q/MABDZz81XU7hF4KTKv5N8g~~/AANUOwA~/RgRlmr91PlcDc3BjQgpjtXU6uGPvwDnEUhJqcGVkcm96YUBncnV2ZXIubXhYBAAAAAA~">
        </body>
        </html>`
}