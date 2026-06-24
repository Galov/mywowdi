import type { ContentLocale } from '@/i18n/config'

type EmailLayoutArgs = {
  bodyHTML?: string
  ctaLabel?: string
  ctaUrl?: string
  intro: string
  locale?: ContentLocale
  preview?: string
  title: string
}

const localeSignoffs: Record<ContentLocale, string> = {
  bg: 'Екипът на MYWOWDI',
  de: 'Das MYWOWDI Team',
  en: 'The MYWOWDI team',
  es: 'El equipo de MYWOWDI',
  fr: "L'equipe MYWOWDI",
  it: 'Il team MYWOWDI',
}

const localeFallbackNotes: Record<ContentLocale, string> = {
  bg: 'Ако бутонът не работи, копирайте и поставете този адрес в браузъра си:',
  de: 'Falls der Button nicht funktioniert, kopieren Sie bitte diesen Link in Ihren Browser:',
  en: 'If the button does not work, copy and paste this URL into your browser:',
  es: 'Si el boton no funciona, copie y pegue esta URL en su navegador:',
  fr: "Si le bouton ne fonctionne pas, copiez et collez cette URL dans votre navigateur :",
  it: 'Se il pulsante non funziona, copia e incolla questo URL nel browser:',
}

export const renderEmailLayout = ({
  bodyHTML,
  ctaLabel,
  ctaUrl,
  intro,
  locale = 'en',
  preview,
  title,
}: EmailLayoutArgs) => {
  const fallbackNote = localeFallbackNotes[locale]
  const signoff = localeSignoffs[locale]

  return `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${preview || title}
    </div>
    <div style="margin:0;padding:32px 16px;background:#f4efe7;font-family:Arial,sans-serif;color:#261713;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;border-collapse:collapse;">
        <tr>
          <td style="padding:0;">
            <div style="background:linear-gradient(180deg,#2d1b15 0%,#24140f 100%);border-radius:28px;padding:40px 36px;border:1px solid rgba(216,186,150,0.16);box-shadow:0 24px 60px rgba(36,20,15,0.18);">
              <div style="margin-bottom:28px;">
                <div style="font-size:12px;letter-spacing:0.32em;text-transform:uppercase;color:#d8ba96;opacity:0.9;margin-bottom:14px;">
                  MYWOWDI
                </div>
                <h1 style="margin:0;font-size:34px;line-height:1.08;font-weight:500;color:#f8efe3;">
                  ${title}
                </h1>
              </div>

              <p style="margin:0 0 28px;font-size:16px;line-height:1.75;color:#eadbca;">
                ${intro}
              </p>

              ${
                bodyHTML
                  ? `
                <div style="margin:0 0 28px;padding:22px 22px 18px;border-radius:22px;background:rgba(248,239,227,0.06);border:1px solid rgba(216,186,150,0.18);color:#f4e8da;">
                  ${bodyHTML}
                </div>
              `
                  : ''
              }

              ${
                ctaUrl && ctaLabel
                  ? `
                <div style="margin:0 0 28px;">
                  <a
                    href="${ctaUrl}"
                    style="display:inline-block;padding:15px 24px;border-radius:999px;background:#d8ba96;color:#24140f;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;"
                  >
                    ${ctaLabel}
                  </a>
                </div>

                <div style="margin:0 0 28px;padding-top:24px;border-top:1px solid rgba(216,186,150,0.18);">
                  <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#cdb39a;">
                    ${fallbackNote}
                  </p>
                  <p style="margin:0;font-size:13px;line-height:1.7;color:#f2e6d7;word-break:break-word;">
                    <a href="${ctaUrl}" style="color:#f2e6d7;text-decoration:underline;">${ctaUrl}</a>
                  </p>
                </div>
              `
                  : ''
              }

              <p style="margin:0;font-size:14px;line-height:1.7;color:#cdb39a;">
                ${signoff}
              </p>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `
}

type FormSubmissionEmailArgs = {
  bodyHTML: string
  locale?: ContentLocale
}

const formSubmissionCopy: Record<
  ContentLocale,
  {
    title: string
  }
> = {
  bg: {
    title: 'Получихте ново съобщение',
  },
  de: {
    title: 'Sie haben eine neue Nachricht erhalten',
  },
  en: {
    title: 'You have received a new message',
  },
  es: {
    title: 'Ha recibido un nuevo mensaje',
  },
  fr: {
    title: 'Vous avez recu un nouveau message',
  },
  it: {
    title: 'Hai ricevuto un nuovo messaggio',
  },
}

export const getFormSubmissionSubject = (locale: ContentLocale = 'en') =>
  formSubmissionCopy[locale].title

export const buildFormSubmissionEmail = ({
  bodyHTML,
  locale = 'en',
}: FormSubmissionEmailArgs) => {
  const copy = formSubmissionCopy[locale]

  return `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${copy.title}
    </div>
    <div style="margin:0;padding:12px;background:#eee5d8;font-family:Arial,sans-serif;color:#261713;">
      <div style="max-width:640px;margin:0 auto;background:#2d1b15;border-radius:28px;padding:28px 24px;border:1px solid rgba(216,186,150,0.16);box-sizing:border-box;">
        <div style="font-size:12px;letter-spacing:0.32em;text-transform:uppercase;color:#d8ba96;opacity:0.9;margin:0 0 20px;">
          MYWOWDI
        </div>
        <div style="font-size:15px;line-height:1.7;color:#f4e8da;">
          ${bodyHTML}
        </div>
      </div>
    </div>
  `
}

type OrderAccessEmailArgs = {
  locale?: ContentLocale
  orderID: string
  orderURL: string
}

const orderAccessCopy: Record<
  ContentLocale,
  {
    intro: (orderID: string) => string
    preview: string
    subject: (orderID: string) => string
    title: string
  }
> = {
  bg: {
    intro: (orderID) =>
      `Изпращаме ви защитен линк, чрез който можете да отворите поръчка #${orderID} и да видите нейните детайли.`,
    preview: 'Защитен линк към вашата поръчка',
    subject: (orderID) => `Достъп до поръчка #${orderID} | MYWOWDI`,
    title: 'Достъп до вашата поръчка',
  },
  de: {
    intro: (orderID) =>
      `Wir senden Ihnen einen sicheren Link, uber den Sie Bestellung #${orderID} offnen und ihre Details ansehen konnen.`,
    preview: 'Sicherer Link zu Ihrer Bestellung',
    subject: (orderID) => `Zugriff auf Bestellung #${orderID} | MYWOWDI`,
    title: 'Zugriff auf Ihre Bestellung',
  },
  en: {
    intro: (orderID) =>
      `We are sending you a secure link so you can open order #${orderID} and review its details.`,
    preview: 'Secure link to your order',
    subject: (orderID) => `Access your order #${orderID} | MYWOWDI`,
    title: 'Access your order',
  },
  es: {
    intro: (orderID) =>
      `Le enviamos un enlace seguro para abrir el pedido #${orderID} y revisar sus detalles.`,
    preview: 'Enlace seguro a su pedido',
    subject: (orderID) => `Acceso al pedido #${orderID} | MYWOWDI`,
    title: 'Acceso a su pedido',
  },
  fr: {
    intro: (orderID) =>
      `Nous vous envoyons un lien securise pour ouvrir la commande #${orderID} et consulter ses details.`,
    preview: 'Lien securise vers votre commande',
    subject: (orderID) => `Acces a la commande #${orderID} | MYWOWDI`,
    title: 'Acces a votre commande',
  },
  it: {
    intro: (orderID) =>
      `Le inviamo un link sicuro per aprire l'ordine #${orderID} e consultarne i dettagli.`,
    preview: 'Link sicuro al tuo ordine',
    subject: (orderID) => `Accesso all'ordine #${orderID} | MYWOWDI`,
    title: 'Accedi al tuo ordine',
  },
}

export const buildOrderAccessEmail = ({
  locale = 'en',
  orderID,
  orderURL,
}: OrderAccessEmailArgs) => {
  const copy = orderAccessCopy[locale]

  return {
    html: renderEmailLayout({
      ctaLabel: copy.title,
      ctaUrl: orderURL,
      intro: copy.intro(orderID),
      locale,
      preview: copy.preview,
      title: copy.title,
    }),
    subject: copy.subject(orderID),
  }
}

type ResetPasswordEmailArgs = {
  locale?: ContentLocale
  resetURL: string
}

const resetPasswordCopy: Record<
  ContentLocale,
  {
    intro: string
    preview: string
    subject: string
    title: string
  }
> = {
  bg: {
    intro: 'Получавате този имейл, защото беше заявена смяна на паролата за вашия профил в MYWOWDI.',
    preview: 'Линк за смяна на паролата',
    subject: 'Смяна на паролата | MYWOWDI',
    title: 'Създайте нова парола',
  },
  de: {
    intro: 'Sie erhalten diese E-Mail, weil ein Passwort-Reset fur Ihr MYWOWDI-Konto angefordert wurde.',
    preview: 'Link zum Zurucksetzen des Passworts',
    subject: 'Passwort zurucksetzen | MYWOWDI',
    title: 'Erstellen Sie ein neues Passwort',
  },
  en: {
    intro: 'You are receiving this email because a password reset was requested for your MYWOWDI account.',
    preview: 'Password reset link',
    subject: 'Reset your password | MYWOWDI',
    title: 'Create a new password',
  },
  es: {
    intro: 'Recibe este correo porque se solicito un restablecimiento de contrasena para su cuenta de MYWOWDI.',
    preview: 'Enlace para restablecer la contrasena',
    subject: 'Restablecer contrasena | MYWOWDI',
    title: 'Cree una nueva contrasena',
  },
  fr: {
    intro: 'Vous recevez cet e-mail car une reinitialisation du mot de passe a ete demandee pour votre compte MYWOWDI.',
    preview: 'Lien de reinitialisation du mot de passe',
    subject: 'Reinitialiser votre mot de passe | MYWOWDI',
    title: 'Creez un nouveau mot de passe',
  },
  it: {
    intro: 'Riceve questa email perche e stato richiesto il reset della password del suo account MYWOWDI.',
    preview: 'Link per reimpostare la password',
    subject: 'Reimposta la password | MYWOWDI',
    title: 'Crea una nuova password',
  },
}

export const buildResetPasswordEmail = ({
  locale = 'en',
  resetURL,
}: ResetPasswordEmailArgs) => {
  const copy = resetPasswordCopy[locale]

  return {
    html: renderEmailLayout({
      ctaLabel: copy.title,
      ctaUrl: resetURL,
      intro: copy.intro,
      locale,
      preview: copy.preview,
      title: copy.title,
    }),
    subject: copy.subject,
  }
}

type InquiryEmailArgs = {
  customerName: string
  inquiryReference: string
  itemsHTML: string
  locale?: ContentLocale
  total: string
}

type InquiryAdminEmailArgs = InquiryEmailArgs & {
  billingAddressHTML: string
  customerEmail: string
  customerPhone?: string
  shippingAddressHTML: string
}

const inquiryCustomerCopy: Record<
  ContentLocale,
  {
    intro: (customerName: string, inquiryReference: string) => string
    preview: string
    subject: (inquiryReference: string) => string
    title: string
  }
> = {
  bg: {
    intro: (customerName, inquiryReference) =>
      `${customerName}, получихме Вашето запитване с номер ${inquiryReference}. Ще се свържем с Вас възможно най-скоро, за да уточним доставката и следващите стъпки.`,
    preview: 'Потвърждение за получено запитване',
    subject: (inquiryReference) => `Получихме Вашето запитване ${inquiryReference} | MYWOWDI`,
    title: 'Получихме Вашето запитване',
  },
  de: {
    intro: (customerName, inquiryReference) =>
      `${customerName}, wir haben Ihre Anfrage mit der Nummer ${inquiryReference} erhalten. Wir melden uns bald bei Ihnen, um Lieferung und die nachsten Schritte zu besprechen.`,
    preview: 'Bestatigung Ihrer Anfrage',
    subject: (inquiryReference) => `Ihre Anfrage ${inquiryReference} wurde empfangen | MYWOWDI`,
    title: 'Wir haben Ihre Anfrage erhalten',
  },
  en: {
    intro: (customerName, inquiryReference) =>
      `${customerName}, we have received your inquiry ${inquiryReference}. We will contact you shortly to confirm delivery details and the next steps.`,
    preview: 'Your inquiry confirmation',
    subject: (inquiryReference) => `We received your inquiry ${inquiryReference} | MYWOWDI`,
    title: 'Your inquiry has been received',
  },
  es: {
    intro: (customerName, inquiryReference) =>
      `${customerName}, hemos recibido su consulta ${inquiryReference}. Nos pondremos en contacto con usted muy pronto para confirmar la entrega y los siguientes pasos.`,
    preview: 'Confirmacion de consulta',
    subject: (inquiryReference) => `Hemos recibido su consulta ${inquiryReference} | MYWOWDI`,
    title: 'Hemos recibido su consulta',
  },
  fr: {
    intro: (customerName, inquiryReference) =>
      `${customerName}, nous avons bien recu votre demande ${inquiryReference}. Nous vous contacterons rapidement pour confirmer la livraison et les prochaines etapes.`,
    preview: 'Confirmation de votre demande',
    subject: (inquiryReference) => `Nous avons recu votre demande ${inquiryReference} | MYWOWDI`,
    title: 'Votre demande a bien ete recue',
  },
  it: {
    intro: (customerName, inquiryReference) =>
      `${customerName}, abbiamo ricevuto la sua richiesta ${inquiryReference}. La contatteremo presto per confermare la consegna e i passaggi successivi.`,
    preview: 'Conferma della richiesta',
    subject: (inquiryReference) => `Abbiamo ricevuto la sua richiesta ${inquiryReference} | MYWOWDI`,
    title: 'Abbiamo ricevuto la sua richiesta',
  },
}

const inquiryAdminCopy: Record<
  ContentLocale,
  {
    intro: (inquiryReference: string) => string
    preview: string
    subject: (inquiryReference: string) => string
    title: string
  }
> = {
  bg: {
    intro: (inquiryReference) =>
      `Постъпи ново запитване с номер ${inquiryReference}. По-долу са изпратените продукти и данните за контакт.`,
    preview: 'Ново запитване от checkout-а',
    subject: (inquiryReference) => `Ново запитване ${inquiryReference} | MYWOWDI`,
    title: 'Ново запитване от сайта',
  },
  de: {
    intro: (inquiryReference) =>
      `Es ist eine neue Anfrage mit der Nummer ${inquiryReference} eingegangen. Unten finden Sie die ausgewahlten Produkte und die Kontaktdaten.`,
    preview: 'Neue Anfrage vom Checkout',
    subject: (inquiryReference) => `Neue Anfrage ${inquiryReference} | MYWOWDI`,
    title: 'Neue Anfrage von der Website',
  },
  en: {
    intro: (inquiryReference) =>
      `A new inquiry ${inquiryReference} has been submitted. The selected products and contact details are listed below.`,
    preview: 'New inquiry from checkout',
    subject: (inquiryReference) => `New inquiry ${inquiryReference} | MYWOWDI`,
    title: 'New inquiry from the website',
  },
  es: {
    intro: (inquiryReference) =>
      `Se ha enviado una nueva consulta ${inquiryReference}. A continuacion se muestran los productos seleccionados y los datos de contacto.`,
    preview: 'Nueva consulta desde checkout',
    subject: (inquiryReference) => `Nueva consulta ${inquiryReference} | MYWOWDI`,
    title: 'Nueva consulta desde el sitio web',
  },
  fr: {
    intro: (inquiryReference) =>
      `Une nouvelle demande ${inquiryReference} a ete envoyee. Les produits selectionnes et les coordonnees figurent ci-dessous.`,
    preview: 'Nouvelle demande depuis le checkout',
    subject: (inquiryReference) => `Nouvelle demande ${inquiryReference} | MYWOWDI`,
    title: 'Nouvelle demande du site',
  },
  it: {
    intro: (inquiryReference) =>
      `E stata inviata una nuova richiesta ${inquiryReference}. Di seguito trova i prodotti selezionati e i dati di contatto.`,
    preview: 'Nuova richiesta dal checkout',
    subject: (inquiryReference) => `Nuova richiesta ${inquiryReference} | MYWOWDI`,
    title: 'Nuova richiesta dal sito',
  },
}

export const buildInquiryCustomerEmail = ({
  customerName,
  inquiryReference,
  itemsHTML,
  locale = 'en',
  total,
}: InquiryEmailArgs) => {
  const copy = inquiryCustomerCopy[locale]

  return {
    html: renderEmailLayout({
      bodyHTML: `
        <div style="margin:0 0 14px;padding:0 0 14px;border-bottom:1px solid rgba(216,186,150,0.16);">
          <div style="margin:0 0 6px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#cdb39a;">
            Референция
          </div>
          <div style="font-size:16px;line-height:1.6;color:#f4e8da;">
            ${inquiryReference}
          </div>
        </div>
        ${itemsHTML}
        <div style="font-size:16px;line-height:1.6;color:#f4e8da;">
          <strong>Обща стойност на продуктите:</strong> ${total}
        </div>
      `,
      intro: copy.intro(customerName, inquiryReference),
      locale,
      preview: copy.preview,
      title: copy.title,
    }),
    subject: copy.subject(inquiryReference),
  }
}

export const buildInquiryAdminEmail = ({
  billingAddressHTML,
  customerEmail,
  customerName,
  customerPhone,
  inquiryReference,
  itemsHTML,
  locale = 'en',
  shippingAddressHTML,
  total,
}: InquiryAdminEmailArgs) => {
  const copy = inquiryAdminCopy[locale]

  return {
    html: renderEmailLayout({
      bodyHTML: `
        <div style="margin:0 0 14px;padding:0 0 14px;border-bottom:1px solid rgba(216,186,150,0.16);">
          <div style="margin:0 0 6px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#cdb39a;">
            Референция
          </div>
          <div style="font-size:16px;line-height:1.6;color:#f4e8da;">
            ${inquiryReference}
          </div>
        </div>
        <div style="margin:0 0 14px;padding:0 0 14px;border-bottom:1px solid rgba(216,186,150,0.16);">
          <div style="margin:0 0 6px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#cdb39a;">
            Клиент
          </div>
          <div style="font-size:16px;line-height:1.75;color:#f4e8da;">
            ${customerName}<br />
            ${customerEmail}${customerPhone ? `<br />${customerPhone}` : ''}
          </div>
        </div>
        <div style="margin:0 0 14px;padding:0 0 14px;border-bottom:1px solid rgba(216,186,150,0.16);">
          <div style="margin:0 0 6px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#cdb39a;">
            Адрес за фактуриране
          </div>
          <div style="font-size:16px;line-height:1.75;color:#f4e8da;">
            ${billingAddressHTML}
          </div>
        </div>
        <div style="margin:0 0 14px;padding:0 0 14px;border-bottom:1px solid rgba(216,186,150,0.16);">
          <div style="margin:0 0 6px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#cdb39a;">
            Адрес за доставка
          </div>
          <div style="font-size:16px;line-height:1.75;color:#f4e8da;">
            ${shippingAddressHTML}
          </div>
        </div>
        ${itemsHTML}
        <div style="font-size:16px;line-height:1.6;color:#f4e8da;">
          <strong>Обща стойност на продуктите:</strong> ${total}
        </div>
      `,
      intro: copy.intro(inquiryReference),
      locale,
      preview: copy.preview,
      title: copy.title,
    }),
    subject: copy.subject(inquiryReference),
  }
}
