"use server";

export async function submitContactForm(formData: FormData) {
  const data = {
    name: formData.get('name'),
    mobile: formData.get('mobile'),
    email: formData.get('email'),
    type: formData.get('type'),
    date: formData.get('date'),
    startTime: formData.get('startTime'),
    endTime: formData.get('endTime'),
    participants: formData.get('participants'),
    organization: formData.get('organization'),
    message: formData.get('message'),
  };

  console.log("=========================================");
  console.log("NEW INQUIRY RECEIVED & EMAIL SENT (MOCK)");
  console.log("=========================================");
  console.log(JSON.stringify(data, null, 2));
  console.log("=========================================");
  
  // In a real application, you would save this to a database
  // and send an email using nodemailer or a service like Resend/SendGrid.

  return { success: true, message: "Inquiry submitted successfully! We will contact you soon." };
}
