import { sendEmail } from "./sendEmail";

export async function sendWelcomeEmail(email: string, name: string) {
  await sendEmail({
    to: email,
    subject: "Welcome to MECO",
    message: `Hello ${name},

Welcome to MECO.

Your account has been created successfully. You can now book automotive services and manage your bookings from your dashboard.

Thank you for choosing MECO.`,
  });
}

export async function sendPaymentSuccessEmail(booking: any) {
  await sendEmail({
    to: booking.customer_email,
    subject: "Payment Successful - MECO",
    message: `Hello ${booking.customer_name},

Your payment for ${booking.service_title} was successful.

Booking Date: ${booking.booking_date}
Time: ${booking.booking_time}
Amount: ₦${Number(booking.total || 0).toLocaleString()}

We will assign a mechanic shortly.`,
  });
}

export async function sendMechanicAssignedEmail(booking: any, mechanic: any) {
  await sendEmail({
    to: booking.customer_email,
    subject: "Mechanic Assigned - MECO",
    message: `Hello ${booking.customer_name},

A mechanic has been assigned to your booking.

Mechanic: ${mechanic.full_name}
Service: ${booking.service_title}
Date: ${booking.booking_date}
Time: ${booking.booking_time}

Your mechanic will attend to you as scheduled.`,
  });
}

export async function sendNewJobEmail(booking: any, mechanic: any) {
  await sendEmail({
    to: mechanic.email,
    subject: "New Job Assigned - MECO",
    message: `Hello ${mechanic.full_name},

You have been assigned a new job.

Customer: ${booking.customer_name}
Phone: ${booking.customer_phone || "No phone number"}
Service: ${booking.service_title}
Address: ${booking.address}
Date: ${booking.booking_date}
Time: ${booking.booking_time}`,
  });
}

export async function sendJobAcceptedEmail(booking: any) {
  await sendEmail({
    to: booking.customer_email,
    subject: "Mechanic Accepted Your Booking - MECO",
    message: `Hello ${booking.customer_name},

Your mechanic has accepted your booking.

Service: ${booking.service_title}
Date: ${booking.booking_date}
Time: ${booking.booking_time}

The mechanic is preparing to attend to your service.`,
  });
}

export async function sendJobCompletedEmail(booking: any) {
  await sendEmail({
    to: booking.customer_email,
    subject: "Job Completed - MECO",
    message: `Hello ${booking.customer_name},

Your ${booking.service_title} service has been completed successfully.

Thank you for trusting MECO.`,
  });
}

export async function sendMechanicApprovedEmail(mechanic: any) {
  await sendEmail({
    to: mechanic.email,
    subject: "Mechanic Application Approved - MECO",
    message: `Hello ${mechanic.full_name},

Congratulations! Your MECO mechanic application has been approved.

You can now log in and start receiving assigned jobs.`,
  });
}

export async function sendMechanicRejectedEmail(mechanic: any) {
  await sendEmail({
    to: mechanic.email,
    subject: "Mechanic Application Update - MECO",
    message: `Hello ${mechanic.full_name},

Unfortunately, your MECO mechanic application was not approved at this time.

You may contact support for more information.`,
  });
}