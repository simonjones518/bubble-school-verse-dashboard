
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { School, SchoolFormData } from "@/types/school";

const schoolFormSchema = z.object({
  name: z.string().min(2, { message: "School name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  status: z.boolean().default(true),
});

type SchoolFormValues = z.infer<typeof schoolFormSchema>;

interface SchoolFormProps {
  initialData?: School;
  isSubmitting: boolean;
  onSubmit: (data: SchoolFormData) => void;
  onCancel: () => void;
}

export function SchoolForm({
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
}: SchoolFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(
    initialData?.logo
  );

  // Initialize form with default values or existing school data
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      status: initialData ? initialData.status === "active" : true,
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (values: SchoolFormValues) => {
    const formData: SchoolFormData = {
      ...values,
      logo: logoFile,
    };
    onSubmit(formData);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div className="col-span-1 md:col-span-2">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("logo-upload")?.click()}
            >
              {logoPreview ? (
                <div className="relative">
                  <img
                    src={logoPreview}
                    alt="School logo preview"
                    className="w-32 h-32 object-contain mb-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-0 right-0 rounded-full p-1 h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLogoFile(null);
                      setLogoPreview(undefined);
                    }}
                  >
                    <Icons.close className="h-4 w-4" />
                    <span className="sr-only">Remove logo</span>
                  </Button>
                </div>
              ) : (
                <>
                  <Icons.image className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Drag & drop or click to upload school logo
                  </p>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG (max. 2MB)
                  </p>
                </>
              )}
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
          </div>

          {/* School Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter school name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address*</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="school@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    School will be visible to users when active
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Address */}
          <div className="col-span-1 md:col-span-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter full address"
                      className="h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Icons.building className="mr-2 h-4 w-4 animate-spin" />
            )}
            {initialData ? "Update School" : "Add School"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
