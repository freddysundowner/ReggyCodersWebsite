import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

export default function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = async (data: InsertContact) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");

      toast({
        title: "Message sent successfully!",
        description: "We will get back to you soon.",
      });

      form.reset();
    } catch {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      value: "Spur Mall, 1st Floor, Room F48"
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@reggycodas.com"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+254 720 044 055"
    }
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" }
  ];

  return (
    <section id="contact" className="py-24 bg-background lg:py-28">
      <div className="section-shell">
        <div className="text-center mb-16">
          <p className="eyebrow text-accent">Start a conversation</p><h2 className="display-type mt-4 text-4xl font-bold text-foreground md:text-5xl">Let’s make your next<br /><span className="text-primary/40">business move clearer.</span></h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto mt-6">
            Maximizing business potential through technology. Tell us what you’re working on.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
           <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-8">
               <h3 className="display-type text-2xl font-bold mb-6">Send us a message</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="info@reggycodas.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (Optional)</FormLabel>
                        <FormControl>
                           <Input placeholder="Your company name" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Interest</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                           <SelectItem value="custom-software">Custom Software</SelectItem>
                           <SelectItem value="ai-automation">AI & Automation</SelectItem>
                           <SelectItem value="cloud-solutions">Cloud Solutions</SelectItem>
                           <SelectItem value="business-automation">Business Automation</SelectItem>
                           <SelectItem value="consultation">Technology Consultation</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your project or inquiry..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                     className="w-full rounded-md bg-primary"
                    disabled={isSubmitting}
                  >
                     {isSubmitting ? "Sending..." : "Send message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="display-type text-2xl font-bold mb-6">Find us here</h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start">
                      <div className="bg-secondary text-primary w-12 h-12 flex items-center justify-center mr-4">
                        <Icon className="text-white h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{info.title}</h4>
                        <p className="text-muted-foreground">{info.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="text-primary h-6 w-6 mr-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Office Hours</h4>
                </div>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{schedule.day}</span>
                      <span>{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
