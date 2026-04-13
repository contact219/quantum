import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { Link } from "wouter";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  bondType: z.string().optional(),
  message: z.string().min(10, "Please provide a brief message"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const BOND_TYPES = [
  "Bid Bond",
  "Performance Bond",
  "Payment Bond",
  "Contractor License Bond",
  "Notary Bond",
  "Auto Dealer Bond",
  "Maintenance/Warranty Bond",
  "Probate/Court Bond",
  "Other / Not Sure",
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      bondType: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Failed to send. Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Could not reach the server. Please try again.", variant: "destructive" });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center shadow-lg">
          <CardContent className="pt-10 pb-10">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Message Received</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for reaching out. A member of our team will respond within one business day.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/quote">
                <Button>Get a Quote</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50">
      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <MessageSquare className="w-4 h-4" />
            We respond within 1 business day
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Quantum Surety</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Questions about surety bonds? Need a quote? We're here to help Texas contractors and businesses get bonded fast.
          </p>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact Info Column */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardContent className="pt-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a href="tel:+19723799216" className="text-indigo-600 hover:underline text-sm">(972) 379-9216</a>
                    <p className="text-xs text-muted-foreground mt-0.5">Mon–Fri, 8am–6pm CT</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href="mailto:administrator@quantumsurety.bond" className="text-teal-600 hover:underline text-sm">administrator@quantumsurety.bond</a>
                    <p className="text-xs text-muted-foreground mt-0.5">We reply within 1 business day</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Based in Texas</p>
                    <p className="text-sm text-muted-foreground">Licensed in all 50 states</p>
                    <p className="text-xs text-muted-foreground mt-0.5">TDI License #3480229</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Business Hours</p>
                    <p className="text-sm text-muted-foreground">Monday – Friday</p>
                    <p className="text-sm text-muted-foreground">8:00 AM – 6:00 PM CT</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm bg-indigo-600 text-white">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2">Need a bond fast?</h3>
                <p className="text-indigo-100 text-sm mb-4">
                  Use our instant quote wizard — most bonds are quoted in under 5 minutes.
                </p>
                <Link href="/quote">
                  <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-indigo-600">
                    Get an Instant Quote
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Try our AI Bond Finder</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Not sure which bond you need? Chat with our AI assistant and get an instant recommendation.
                </p>
                <Link href="/chatbot">
                  <Button variant="outline" className="w-full">Open Quantum Quote Assistant</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and our team will reach out promptly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl><Input placeholder="John Smith" {...field} data-testid="input-name" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl><Input type="email" placeholder="john@company.com" {...field} data-testid="input-email" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl><Input type="tel" placeholder="(555) 123-4567" {...field} data-testid="input-phone" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl><Input placeholder="ABC Construction LLC" {...field} data-testid="input-company" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="bondType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bond Type of Interest</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-bond-type">
                              <SelectValue placeholder="Select a bond type (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BOND_TYPES.map((bt) => (
                              <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us what you need — bond amount, project details, timeline, or any questions you have."
                            rows={5}
                            {...field}
                            data-testid="textarea-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <Button type="submit" size="lg" className="w-full" style={{backgroundColor:"#4338ca",color:"#fff"}} data-testid="button-submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? "Sending…" : "Send Message"}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By submitting this form you agree to our{" "}
                      <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
                      We never sell your information.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
