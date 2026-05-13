import emailjs from '@emailjs/browser'

export const SERVICE_ID = 'service_hxxq1i6'
export const TEMPLATE_ID = 'template_8qpa7qq'
export const PUBLIC_KEY = 'tlLPvlsrbWp7LMzsq'

export const sendEmail = async (formData) => {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_name: 'Muhamad Sidiq',
    },
    PUBLIC_KEY
  )
}
