"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { showApi, CreateShowData, TicketType } from '@/lib/api/show';
import { categoryApi, Category } from '@/lib/api/category';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Plus, X, Upload } from 'lucide-react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; 
import { ImageUpload } from '@/components/image-upload';
import { MultiImageUpload } from '@/components/multi-image-upload';
import mongoose from 'mongoose';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  duration: z.string().min(1, 'Duration is required'),
  mainImage: z.string().min(1, 'Main image is required'),
  images: z.array(z.string()),
  categoryId: z.string().min(1, 'Category is required'),
  regularPrice: z.string().min(1, 'Regular price is required'),
  vipPrice: z.string().min(1, 'VIP price is required'),
});

export default function CreateEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
 


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      duration: '',
      mainImage: '',
      images: [],
      categoryId: '',
      regularPrice: '',
      vipPrice: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ticketTypes',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryApi.getAllCategories();
      setCategories(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      // Ensure we have at least two ticket types for regular and VIP
      if (values.ticketTypes.length < 2) {
        toast({
          title: 'Error',
          description: 'Please add both regular and VIP ticket types',
          variant: 'destructive',
        });
        return;
      }

      // Convert string IDs to ObjectId
      const createdBy = new mongoose.Types.ObjectId("65f1a1b1b1b1b1b1b1b1b1b1"); // TODO: Replace with actual user ID

      const eventData: CreateShowData = {
        title: values.title.trim(),
        description: values.description.trim(),
        duration: parseInt(values.duration),
        category: values.categoryId,
        price: {
          regular: parseFloat(values.regularPrice),
          vip: parseFloat(values.vipPrice)
        },
        showTimes: [{
          date: new Date(values.date),
          startTime: values.date.split('T')[1],
          endTime: new Date(new Date(values.date).getTime() + parseInt(values.duration) * 60000).toISOString().split('T')[1]
        }],
        images: [values.mainImage, ...values.images].filter(Boolean),
        createdBy: createdBy.toString(),
        status: 'draft' as const
      };

      console.log('Submitting data:', eventData); // Debug log

      await showApi.createShow(eventData);
      toast({
        title: 'Success',
        description: 'Event created successfully',
      });
      router.push('/admin/events');
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter event description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date and Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter event duration"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="regularPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regular Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter regular price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vipPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIP Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter VIP price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="mainImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    onImageUploaded={(url) => {
                      field.onChange(url);
                      setMainImagePreview(url);
                    }}
                    defaultImage={mainImagePreview}
                    onRemove={() => {
                      field.onChange('');
                      setMainImagePreview('');
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Additional Images</FormLabel>
            <div className="flex items-center gap-4">
              <div className="relative">
              <MultiImageUpload
                  defaultImages={form.getValues('images')}
                  onImagesChange={(urls) => {
                    form.setValue('images', urls);
                    console.log(3333,urls);
                    
                    setAdditionalImagesPreview(urls);
                  }}
                  maxImages={8}
                />
              </div>
          
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Ticket Types</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: '', price: '', quantity: '', description: '' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Ticket Type
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                <FormField
                  control={form.control}
                  name={`ticketTypes.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Ticket type name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`ticketTypes.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`ticketTypes.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Quantity"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`ticketTypes.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Description (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
