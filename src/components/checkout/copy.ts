import type { ContentLocale } from '@/i18n/config'

type CartCopy = {
  decreaseQuantity: string
  increaseQuantity: string
  cart: string
  cartDescription: string
  cartEmpty: string
  proceedToCheckout: string
  removeCartItem: string
  total: string
}

type CheckoutCopy = {
  address: string
  billingAddress: string
  cancelPayment: string
  confirmOrder: string
  contact: string
  continueAsGuest: string
  continueShopping: string
  checkoutMetaDescription: string
  checkoutMetaTitle: string
  emailAddress: string
  emptyCart: string
  goToPayment: string
  guestCheckoutPrompt: string
  deliveryNotice: string
  deliveryNoticeShort: string
  inquiryError: string
  inquiryNotice: string
  inquiryQuestion: string
  inquiryReferenceLabel: string
  inquirySubmit: string
  inquirySuccessDescription: string
  inquirySuccessTitle: string
  loading: string
  logIn: string
  logOut: string
  loginPrompt: string
  noAddressesFound: string
  notYou: string
  oneOrMoreItemsOutOfStock: string
  payment: string
  processingPayment: string
  quantityPrefix: string
  remove: string
  select: string
  shippingAddress: string
  shippingDescription: string
  shippingSameAsBilling: string
  summaryCart: string
  total: string
  tryAgain: string
  createAccount: string
}

type AddressFormCopy = {
  addressLine1: string
  addressLine1Required: string
  addressLine2: string
  city: string
  cityRequired: string
  company: string
  country: string
  countryPlaceholder: string
  countryRequired: string
  firstName: string
  firstNameRequired: string
  lastName: string
  lastNameRequired: string
  phone: string
  postalCode: string
  postalCodeRequired: string
  state: string
  submit: string
  title: string
  titlePlaceholder: string
  titles: {
    dr: string
    mr: string
    mrs: string
    ms: string
    mx: string
    other: string
    prof: string
  }
}

const cartCopy: Record<ContentLocale, CartCopy> = {
  bg: {
    cart: 'Количка',
    cartDescription: 'Тук можете да прегледате и редактирате избраните продукти.',
    cartEmpty: 'Количката е празна.',
    decreaseQuantity: 'Намали количеството',
    increaseQuantity: 'Увеличи количеството',
    proceedToCheckout: 'Към поръчката',
    removeCartItem: 'Премахни артикул от количката',
    total: 'Общо',
  },
  de: {
    cart: 'Warenkorb',
    cartDescription: 'Hier konnen Sie Ihre ausgewahlten Produkte ansehen und bearbeiten.',
    cartEmpty: 'Ihr Warenkorb ist leer.',
    decreaseQuantity: 'Menge verringern',
    increaseQuantity: 'Menge erhohen',
    proceedToCheckout: 'Zur Kasse',
    removeCartItem: 'Artikel aus dem Warenkorb entfernen',
    total: 'Gesamt',
  },
  en: {
    cart: 'Cart',
    cartDescription: 'Review and manage the items you have selected.',
    cartEmpty: 'Your cart is empty.',
    decreaseQuantity: 'Decrease quantity',
    increaseQuantity: 'Increase quantity',
    proceedToCheckout: 'Proceed to checkout',
    removeCartItem: 'Remove cart item',
    total: 'Total',
  },
  es: {
    cart: 'Carrito',
    cartDescription: 'Aqui puede revisar y editar los productos seleccionados.',
    cartEmpty: 'Su carrito esta vacio.',
    decreaseQuantity: 'Reducir cantidad',
    increaseQuantity: 'Aumentar cantidad',
    proceedToCheckout: 'Ir al pago',
    removeCartItem: 'Eliminar articulo del carrito',
    total: 'Total',
  },
  fr: {
    cart: 'Panier',
    cartDescription: 'Consultez et modifiez les articles que vous avez choisis.',
    cartEmpty: 'Votre panier est vide.',
    decreaseQuantity: 'Reduire la quantite',
    increaseQuantity: 'Augmenter la quantite',
    proceedToCheckout: 'Passer au paiement',
    removeCartItem: 'Retirer l article du panier',
    total: 'Total',
  },
  it: {
    cart: 'Carrello',
    cartDescription: 'Qui puo rivedere e modificare i prodotti selezionati.',
    cartEmpty: 'Il tuo carrello e vuoto.',
    decreaseQuantity: 'Riduci quantita',
    increaseQuantity: 'Aumenta quantita',
    proceedToCheckout: 'Vai al pagamento',
    removeCartItem: 'Rimuovi articolo dal carrello',
    total: 'Totale',
  },
}

const checkoutCopy: Record<ContentLocale, CheckoutCopy> = {
  bg: {
    address: 'Адрес',
    billingAddress: 'Адрес за фактуриране',
    cancelPayment: 'Откажи плащането',
    confirmOrder: 'Потвърждаваме поръчката',
    contact: 'Контакт',
    continueAsGuest: 'Продължи като гост',
    continueShopping: 'Обратно към продуктите',
    checkoutMetaDescription: 'Контакт, адрес и изпращане на запитване за продуктите в количката.',
    checkoutMetaTitle: 'Поръчка',
    createAccount: 'създайте акаунт',
    deliveryNotice:
      'Доставката се извършва с куриер и не е включена в стойността на поръчката. Цената се определя по тарифата на куриерската компания и се заплаща отделно директно на нея.',
    deliveryNoticeShort:
      'Доставката не е включена в общата сума. Тя се заплаща отделно на куриера според неговата тарифа.',
    emailAddress: 'Имейл адрес',
    emptyCart: 'Количката е празна.',
    goToPayment: 'Към плащане',
    guestCheckoutPrompt: 'Въведете имейла си, за да продължите като гост.',
    inquiryError: 'В момента не успяхме да изпратим запитването. Моля, опитайте отново.',
    inquiryNotice:
      'Онлайн плащането ще бъде активно скоро. Дотогава можете да изпратите запитване за продуктите във Вашата количка и ние ще се свържем с Вас, за да уточним доставката и следващите стъпки.',
    inquiryQuestion: 'Искате ли да изпратите запитване за продуктите във Вашата количка?',
    inquiryReferenceLabel: 'Референция',
    inquirySubmit: 'Изпрати запитване',
    inquirySuccessDescription:
      'Получихме Вашето запитване и ще се свържем с Вас възможно най-скоро, за да уточним детайлите по доставката и следващите стъпки.',
    inquirySuccessTitle: 'Благодарим Ви, запитването е изпратено.',
    loading: 'Зареждане...',
    logIn: 'Вход',
    logOut: 'Изход',
    loginPrompt: 'или',
    noAddressesFound: 'Няма запазени адреси. Моля, добавете адрес.',
    notYou: 'Не сте Вие?',
    oneOrMoreItemsOutOfStock: 'Един или повече артикули в количката вече не са налични.',
    payment: 'Плащане',
    processingPayment: 'Обработваме плащането Ви...',
    quantityPrefix: 'x',
    remove: 'Премахни',
    select: 'Избери',
    shippingAddress: 'Адрес за доставка',
    shippingDescription: 'Моля, изберете адрес за доставка.',
    shippingSameAsBilling: 'Адресът за доставка е същият като адреса за фактуриране',
    summaryCart: 'Вашата количка',
    total: 'Общо',
    tryAgain: 'Опитай отново',
  },
  de: {
    address: 'Adresse',
    billingAddress: 'Rechnungsadresse',
    cancelPayment: 'Zahlung abbrechen',
    confirmOrder: 'Wir bestatigen Ihre Bestellung',
    contact: 'Kontakt',
    continueAsGuest: 'Als Gast fortfahren',
    continueShopping: 'Zuruck zu den Produkten',
    checkoutMetaDescription:
      'Kontakt, Adresse und Anfrageversand fur die Produkte im Warenkorb.',
    checkoutMetaTitle: 'Kasse',
    createAccount: 'ein Konto erstellen',
    deliveryNotice:
      'Die Lieferung erfolgt per Kurier und ist nicht im Bestellwert enthalten. Die Kosten richten sich nach dem Tarif des Kurierdienstes und werden direkt an ihn separat bezahlt.',
    deliveryNoticeShort:
      'Die Lieferung ist nicht in der Gesamtsumme enthalten. Sie wird separat direkt an den Kurierdienst bezahlt.',
    emailAddress: 'E-Mail-Adresse',
    emptyCart: 'Ihr Warenkorb ist leer.',
    goToPayment: 'Weiter zur Zahlung',
    guestCheckoutPrompt: 'Geben Sie Ihre E-Mail ein, um als Gast fortzufahren.',
    inquiryError:
      'Ihre Anfrage konnte im Moment nicht gesendet werden. Bitte versuchen Sie es erneut.',
    inquiryNotice:
      'Online-Zahlungen werden in Kurze aktiviert. Bis dahin konnen Sie eine Anfrage fur die Produkte in Ihrem Warenkorb senden und wir melden uns bei Ihnen, um Lieferung und die nachsten Schritte zu klaren.',
    inquiryQuestion: 'Mochten Sie eine Anfrage fur die Produkte in Ihrem Warenkorb senden?',
    inquiryReferenceLabel: 'Referenz',
    inquirySubmit: 'Anfrage senden',
    inquirySuccessDescription:
      'Wir haben Ihre Anfrage erhalten und werden uns in Kurze bei Ihnen melden, um Lieferung und weitere Schritte abzustimmen.',
    inquirySuccessTitle: 'Vielen Dank, Ihre Anfrage wurde gesendet.',
    loading: 'Wird geladen...',
    logIn: 'Anmelden',
    logOut: 'Abmelden',
    loginPrompt: 'oder',
    noAddressesFound: 'Keine gespeicherten Adressen gefunden. Bitte fugen Sie eine Adresse hinzu.',
    notYou: 'Nicht Sie?',
    oneOrMoreItemsOutOfStock: 'Ein oder mehrere Artikel in Ihrem Warenkorb sind nicht mehr verfugbar.',
    payment: 'Zahlung',
    processingPayment: 'Ihre Zahlung wird verarbeitet...',
    quantityPrefix: 'x',
    remove: 'Entfernen',
    select: 'Auswahlen',
    shippingAddress: 'Lieferadresse',
    shippingDescription: 'Bitte wahlen Sie eine Lieferadresse aus.',
    shippingSameAsBilling: 'Lieferadresse entspricht Rechnungsadresse',
    summaryCart: 'Ihr Warenkorb',
    total: 'Gesamt',
    tryAgain: 'Erneut versuchen',
  },
  en: {
    address: 'Address',
    billingAddress: 'Billing address',
    cancelPayment: 'Cancel payment',
    confirmOrder: 'Confirming your order',
    contact: 'Contact',
    continueAsGuest: 'Continue as guest',
    continueShopping: 'Continue shopping',
    checkoutMetaDescription:
      'Contact, address, and inquiry submission for the products in your cart.',
    checkoutMetaTitle: 'Checkout',
    createAccount: 'create an account',
    deliveryNotice:
      'Delivery is arranged with a courier and is not included in the order total. The shipping cost is determined by the courier company and paid separately directly to them.',
    deliveryNoticeShort:
      'Delivery is not included in the total. It is paid separately to the courier according to their tariff.',
    emailAddress: 'Email address',
    emptyCart: 'Your cart is empty.',
    goToPayment: 'Go to payment',
    guestCheckoutPrompt: 'Enter your email to checkout as a guest.',
    inquiryError: 'We could not submit your inquiry right now. Please try again.',
    inquiryNotice:
      'Online payment will be available soon. Until then, you can send an inquiry for the products in your cart and we will contact you to confirm delivery and the next steps.',
    inquiryQuestion: 'Would you like to send an inquiry for the products in your cart?',
    inquiryReferenceLabel: 'Reference',
    inquirySubmit: 'Send inquiry',
    inquirySuccessDescription:
      'We have received your inquiry and will contact you shortly to confirm delivery details and the next steps.',
    inquirySuccessTitle: 'Thank you, your inquiry has been sent.',
    loading: 'Loading...',
    logIn: 'Log in',
    logOut: 'Log out',
    loginPrompt: 'or',
    noAddressesFound: 'No saved addresses found. Please add an address.',
    notYou: 'Not you?',
    oneOrMoreItemsOutOfStock: 'One or more items in your cart are out of stock.',
    payment: 'Payment',
    processingPayment: 'Processing your payment...',
    quantityPrefix: 'x',
    remove: 'Remove',
    select: 'Select',
    shippingAddress: 'Shipping address',
    shippingDescription: 'Please select a shipping address.',
    shippingSameAsBilling: 'Shipping is the same as billing',
    summaryCart: 'Your cart',
    total: 'Total',
    tryAgain: 'Try again',
  },
  es: {
    address: 'Direccion',
    billingAddress: 'Direccion de facturacion',
    cancelPayment: 'Cancelar el pago',
    confirmOrder: 'Estamos confirmando su pedido',
    contact: 'Contacto',
    continueAsGuest: 'Continuar como invitado',
    continueShopping: 'Volver a los productos',
    checkoutMetaDescription:
      'Contacto, direccion y envio de consulta para los productos del carrito.',
    checkoutMetaTitle: 'Pago',
    createAccount: 'crear una cuenta',
    deliveryNotice:
      'La entrega se realiza mediante mensajeria y no esta incluida en el importe del pedido. El coste se determina segun la tarifa de la empresa de mensajeria y se paga aparte directamente a ella.',
    deliveryNoticeShort:
      'La entrega no esta incluida en el total. Se paga aparte directamente al mensajero segun su tarifa.',
    emailAddress: 'Correo electronico',
    emptyCart: 'Su carrito esta vacio.',
    goToPayment: 'Ir al pago',
    guestCheckoutPrompt: 'Introduzca su correo para continuar como invitado.',
    inquiryError:
      'No hemos podido enviar su consulta en este momento. Por favor, intentelo de nuevo.',
    inquiryNotice:
      'El pago en linea estara disponible pronto. Hasta entonces, puede enviar una consulta sobre los productos de su carrito y nos pondremos en contacto con usted para concretar la entrega y los siguientes pasos.',
    inquiryQuestion: 'Desea enviar una consulta sobre los productos de su carrito?',
    inquiryReferenceLabel: 'Referencia',
    inquirySubmit: 'Enviar consulta',
    inquirySuccessDescription:
      'Hemos recibido su consulta y nos pondremos en contacto con usted muy pronto para concretar la entrega y los siguientes pasos.',
    inquirySuccessTitle: 'Gracias, su consulta ha sido enviada.',
    loading: 'Cargando...',
    logIn: 'Iniciar sesion',
    logOut: 'Cerrar sesion',
    loginPrompt: 'o',
    noAddressesFound: 'No hay direcciones guardadas. Anada una direccion.',
    notYou: 'No es usted?',
    oneOrMoreItemsOutOfStock: 'Uno o mas articulos de su carrito ya no estan disponibles.',
    payment: 'Pago',
    processingPayment: 'Estamos procesando su pago...',
    quantityPrefix: 'x',
    remove: 'Eliminar',
    select: 'Seleccionar',
    shippingAddress: 'Direccion de envio',
    shippingDescription: 'Seleccione una direccion de envio.',
    shippingSameAsBilling: 'La direccion de envio es la misma que la de facturacion',
    summaryCart: 'Su carrito',
    total: 'Total',
    tryAgain: 'Intentar de nuevo',
  },
  fr: {
    address: 'Adresse',
    billingAddress: 'Adresse de facturation',
    cancelPayment: 'Annuler le paiement',
    confirmOrder: 'Nous confirmons votre commande',
    contact: 'Contact',
    continueAsGuest: 'Continuer en invite',
    continueShopping: 'Retour aux produits',
    checkoutMetaDescription:
      'Contact, adresse et envoi de demande pour les produits du panier.',
    checkoutMetaTitle: 'Paiement',
    createAccount: 'creer un compte',
    deliveryNotice:
      'La livraison est assuree par un transporteur et n est pas incluse dans le montant de la commande. Son cout est calcule selon le tarif du transporteur et lui est regle separement.',
    deliveryNoticeShort:
      'La livraison n est pas incluse dans le total. Elle est payee separement au transporteur selon son tarif.',
    emailAddress: 'Adresse e-mail',
    emptyCart: 'Votre panier est vide.',
    goToPayment: 'Passer au paiement',
    guestCheckoutPrompt: 'Saisissez votre e-mail pour continuer en invite.',
    inquiryError:
      'Nous n avons pas pu envoyer votre demande pour le moment. Veuillez reessayer.',
    inquiryNotice:
      'Le paiement en ligne sera bientot disponible. D ici la, vous pouvez envoyer une demande pour les produits de votre panier et nous vous contacterons pour confirmer la livraison et les prochaines etapes.',
    inquiryQuestion: 'Souhaitez-vous envoyer une demande pour les produits de votre panier ?',
    inquiryReferenceLabel: 'Reference',
    inquirySubmit: 'Envoyer la demande',
    inquirySuccessDescription:
      'Nous avons bien recu votre demande et nous vous contacterons tres prochainement pour confirmer la livraison et les prochaines etapes.',
    inquirySuccessTitle: 'Merci, votre demande a ete envoyee.',
    loading: 'Chargement...',
    logIn: 'Se connecter',
    logOut: 'Se deconnecter',
    loginPrompt: 'ou',
    noAddressesFound: 'Aucune adresse enregistree. Veuillez en ajouter une.',
    notYou: 'Ce n est pas vous ?',
    oneOrMoreItemsOutOfStock: 'Un ou plusieurs articles de votre panier ne sont plus disponibles.',
    payment: 'Paiement',
    processingPayment: 'Nous traitons votre paiement...',
    quantityPrefix: 'x',
    remove: 'Supprimer',
    select: 'Choisir',
    shippingAddress: 'Adresse de livraison',
    shippingDescription: 'Veuillez selectionner une adresse de livraison.',
    shippingSameAsBilling: 'L adresse de livraison est identique a l adresse de facturation',
    summaryCart: 'Votre panier',
    total: 'Total',
    tryAgain: 'Reessayer',
  },
  it: {
    address: 'Indirizzo',
    billingAddress: 'Indirizzo di fatturazione',
    cancelPayment: 'Annulla il pagamento',
    confirmOrder: 'Stiamo confermando il tuo ordine',
    contact: 'Contatto',
    continueAsGuest: 'Continua come ospite',
    continueShopping: 'Torna ai prodotti',
    checkoutMetaDescription:
      'Contatto, indirizzo e invio della richiesta per i prodotti nel carrello.',
    checkoutMetaTitle: 'Checkout',
    createAccount: 'creare un account',
    deliveryNotice:
      'La consegna avviene tramite corriere e non e inclusa nel totale dell ordine. Il costo viene determinato dalla tariffa del corriere e pagato separatamente direttamente a lui.',
    deliveryNoticeShort:
      'La consegna non e inclusa nel totale. Viene pagata separatamente al corriere secondo la sua tariffa.',
    emailAddress: 'Indirizzo email',
    emptyCart: 'Il tuo carrello e vuoto.',
    goToPayment: 'Vai al pagamento',
    guestCheckoutPrompt: 'Inserisci la tua email per continuare come ospite.',
    inquiryError:
      'Non siamo riusciti a inviare la richiesta in questo momento. Riprova.',
    inquiryNotice:
      'Il pagamento online sara disponibile a breve. Fino ad allora, puo inviare una richiesta per i prodotti nel suo carrello e la contatteremo per confermare la consegna e i prossimi passaggi.',
    inquiryQuestion: 'Vuole inviare una richiesta per i prodotti nel suo carrello?',
    inquiryReferenceLabel: 'Riferimento',
    inquirySubmit: 'Invia richiesta',
    inquirySuccessDescription:
      'Abbiamo ricevuto la sua richiesta e la contatteremo al piu presto per confermare la consegna e i prossimi passaggi.',
    inquirySuccessTitle: 'Grazie, la richiesta e stata inviata.',
    loading: 'Caricamento...',
    logIn: 'Accedi',
    logOut: 'Esci',
    loginPrompt: 'oppure',
    noAddressesFound: 'Nessun indirizzo salvato. Aggiungi un indirizzo.',
    notYou: 'Non sei tu?',
    oneOrMoreItemsOutOfStock: 'Uno o piu articoli nel carrello non sono piu disponibili.',
    payment: 'Pagamento',
    processingPayment: 'Stiamo elaborando il tuo pagamento...',
    quantityPrefix: 'x',
    remove: 'Rimuovi',
    select: 'Seleziona',
    shippingAddress: 'Indirizzo di spedizione',
    shippingDescription: 'Seleziona un indirizzo di spedizione.',
    shippingSameAsBilling: 'L indirizzo di spedizione coincide con quello di fatturazione',
    summaryCart: 'Il tuo carrello',
    total: 'Totale',
    tryAgain: 'Riprova',
  },
}

const addressFormCopy: Record<ContentLocale, AddressFormCopy> = {
  bg: {
    addressLine1: 'Адрес, ред 1*',
    addressLine1Required: 'Адресът е задължителен.',
    addressLine2: 'Адрес, ред 2',
    city: 'Град*',
    cityRequired: 'Градът е задължителен.',
    company: 'Фирма',
    country: 'Държава*',
    countryPlaceholder: 'Изберете държава',
    countryRequired: 'Държавата е задължителна.',
    firstName: 'Име*',
    firstNameRequired: 'Името е задължително.',
    lastName: 'Фамилия*',
    lastNameRequired: 'Фамилията е задължителна.',
    phone: 'Телефон',
    postalCode: 'Пощенски код*',
    postalCodeRequired: 'Пощенският код е задължителен.',
    state: 'Област / регион',
    submit: 'Запази адреса',
    title: 'Обръщение',
    titlePlaceholder: 'Изберете обръщение',
    titles: {
      dr: 'Д-р',
      mr: 'Г-н',
      mrs: 'Г-жа',
      ms: 'Г-ца',
      mx: 'Mx.',
      other: 'Друго',
      prof: 'Проф.',
    },
  },
  de: {
    addressLine1: 'Adresszeile 1*',
    addressLine1Required: 'Adresszeile 1 ist erforderlich.',
    addressLine2: 'Adresszeile 2',
    city: 'Stadt*',
    cityRequired: 'Die Stadt ist erforderlich.',
    company: 'Firma',
    country: 'Land*',
    countryPlaceholder: 'Land auswahlen',
    countryRequired: 'Das Land ist erforderlich.',
    firstName: 'Vorname*',
    firstNameRequired: 'Der Vorname ist erforderlich.',
    lastName: 'Nachname*',
    lastNameRequired: 'Der Nachname ist erforderlich.',
    phone: 'Telefon',
    postalCode: 'Postleitzahl*',
    postalCodeRequired: 'Die Postleitzahl ist erforderlich.',
    state: 'Bundesland / Region',
    submit: 'Adresse speichern',
    title: 'Anrede',
    titlePlaceholder: 'Anrede auswahlen',
    titles: {
      dr: 'Dr.',
      mr: 'Herr',
      mrs: 'Frau',
      ms: 'Frau',
      mx: 'Mx.',
      other: 'Andere',
      prof: 'Prof.',
    },
  },
  en: {
    addressLine1: 'Address line 1*',
    addressLine1Required: 'Address line 1 is required.',
    addressLine2: 'Address line 2',
    city: 'City*',
    cityRequired: 'City is required.',
    company: 'Company',
    country: 'Country*',
    countryPlaceholder: 'Select a country',
    countryRequired: 'Country is required.',
    firstName: 'First name*',
    firstNameRequired: 'First name is required.',
    lastName: 'Last name*',
    lastNameRequired: 'Last name is required.',
    phone: 'Phone',
    postalCode: 'Postal code*',
    postalCodeRequired: 'Postal code is required.',
    state: 'State / region',
    submit: 'Save address',
    title: 'Title',
    titlePlaceholder: 'Select a title',
    titles: {
      dr: 'Dr.',
      mr: 'Mr.',
      mrs: 'Mrs.',
      ms: 'Ms.',
      mx: 'Mx.',
      other: 'Other',
      prof: 'Prof.',
    },
  },
  es: {
    addressLine1: 'Direccion, linea 1*',
    addressLine1Required: 'La direccion es obligatoria.',
    addressLine2: 'Direccion, linea 2',
    city: 'Ciudad*',
    cityRequired: 'La ciudad es obligatoria.',
    company: 'Empresa',
    country: 'Pais*',
    countryPlaceholder: 'Seleccione un pais',
    countryRequired: 'El pais es obligatorio.',
    firstName: 'Nombre*',
    firstNameRequired: 'El nombre es obligatorio.',
    lastName: 'Apellido*',
    lastNameRequired: 'El apellido es obligatorio.',
    phone: 'Telefono',
    postalCode: 'Codigo postal*',
    postalCodeRequired: 'El codigo postal es obligatorio.',
    state: 'Provincia / region',
    submit: 'Guardar direccion',
    title: 'Tratamiento',
    titlePlaceholder: 'Seleccione un tratamiento',
    titles: {
      dr: 'Dr.',
      mr: 'Sr.',
      mrs: 'Sra.',
      ms: 'Srta.',
      mx: 'Mx.',
      other: 'Otro',
      prof: 'Prof.',
    },
  },
  fr: {
    addressLine1: 'Adresse, ligne 1*',
    addressLine1Required: 'L adresse est obligatoire.',
    addressLine2: 'Adresse, ligne 2',
    city: 'Ville*',
    cityRequired: 'La ville est obligatoire.',
    company: 'Entreprise',
    country: 'Pays*',
    countryPlaceholder: 'Choisissez un pays',
    countryRequired: 'Le pays est obligatoire.',
    firstName: 'Prenom*',
    firstNameRequired: 'Le prenom est obligatoire.',
    lastName: 'Nom*',
    lastNameRequired: 'Le nom est obligatoire.',
    phone: 'Telephone',
    postalCode: 'Code postal*',
    postalCodeRequired: 'Le code postal est obligatoire.',
    state: 'Region',
    submit: 'Enregistrer l adresse',
    title: 'Civilite',
    titlePlaceholder: 'Choisissez une civilite',
    titles: {
      dr: 'Dr',
      mr: 'M.',
      mrs: 'Mme',
      ms: 'Mlle',
      mx: 'Mx.',
      other: 'Autre',
      prof: 'Prof.',
    },
  },
  it: {
    addressLine1: 'Indirizzo, riga 1*',
    addressLine1Required: 'L indirizzo e obbligatorio.',
    addressLine2: 'Indirizzo, riga 2',
    city: 'Citta*',
    cityRequired: 'La citta e obbligatoria.',
    company: 'Azienda',
    country: 'Paese*',
    countryPlaceholder: 'Seleziona un paese',
    countryRequired: 'Il paese e obbligatorio.',
    firstName: 'Nome*',
    firstNameRequired: 'Il nome e obbligatorio.',
    lastName: 'Cognome*',
    lastNameRequired: 'Il cognome e obbligatorio.',
    phone: 'Telefono',
    postalCode: 'CAP*',
    postalCodeRequired: 'Il CAP e obbligatorio.',
    state: 'Provincia / regione',
    submit: 'Salva indirizzo',
    title: 'Titolo',
    titlePlaceholder: 'Seleziona un titolo',
    titles: {
      dr: 'Dott.',
      mr: 'Sig.',
      mrs: 'Sig.ra',
      ms: 'Sig.na',
      mx: 'Mx.',
      other: 'Altro',
      prof: 'Prof.',
    },
  },
}

export const getCartCopy = (locale: ContentLocale) => cartCopy[locale] || cartCopy.en

export const getCheckoutCopy = (locale: ContentLocale) =>
  checkoutCopy[locale] || checkoutCopy.en

export const getAddressFormCopy = (locale: ContentLocale) =>
  addressFormCopy[locale] || addressFormCopy.en
