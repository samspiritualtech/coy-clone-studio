import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCategories } from '@/hooks/seller/useCategories';
import { useSellerProducts } from '@/hooks/seller/useSellerProducts';
import { ProductFormData } from '@/types/seller';
import { ArrowLeft, ArrowRight, Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const steps = [
  { id: 1, title: 'Media', description: 'Upload product images' },
  { id: 2, title: 'Details', description: 'Product information' },
  { id: 3, title: 'Category', description: 'Category & tags' },
  { id: 4, title: 'Pricing', description: 'Price & variants' },
  { id: 5, title: 'Dispatch', description: 'Shipping policies' },
  { id: 6, title: 'Review', description: 'Preview & submit' },
];

const SellerAddProduct = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: categories } = useCategories();
  const { createProduct, submitProduct, isCreating } = useSellerProducts();
  
  const [formData, setFormData] = useState<ProductFormData>({
    images: [],
    title: '',
    short_description: '',
    description: '',
    fabric: '',
    care_instructions: '',
    category_id: '',
    occasion_tags: [],
    style_tags: [],
    price: 0,
    original_price: undefined,
    variants: [],
    dispatch_days: 7,
    is_made_to_order: false,
    is_returnable: true,
  });

  const updateFormData = (updates: Partial<ProductFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await createProduct(formData);
      navigate('/seller/products');
    } catch (error) {
      console.error('Save draft error:', error);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (formData.images.length < 3) {
      toast.error('Please upload at least 3 images');
      setCurrentStep(1);
      return;
    }
    if (!formData.title || !formData.short_description) {
      toast.error('Please fill in product title and description');
      setCurrentStep(2);
      return;
    }
    if (!formData.category_id) {
      toast.error('Please select a category');
      setCurrentStep(3);
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error('Please set a valid price');
      setCurrentStep(4);
      return;
    }

    try {
      const product = await createProduct(formData);
      await submitProduct(product.id);
      navigate('/seller/products');
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop images here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Minimum 3 images required. First image will be the cover.
              </p>
              <Input
                type="file"
                accept="image/*"
                multiple
                className="mt-4 max-w-xs mx-auto"
                onChange={(e) => {
                  // In a real app, you'd upload to storage and get URLs
                  const files = Array.from(e.target.files || []);
                  const newImages = files.map(f => URL.createObjectURL(f));
                  updateFormData({ images: [...formData.images, ...newImages] });
                }}
              />
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => updateFormData({ 
                        images: formData.images.filter((_, i) => i !== idx) 
                      })}
                      className="absolute top-1 right-1 p-1 bg-background/80 rounded-full hover:bg-background"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Name *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                placeholder="e.g., Handwoven Silk Saree"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description *</Label>
              <Textarea
                id="short_description"
                value={formData.short_description}
                onChange={(e) => updateFormData({ short_description: e.target.value })}
                placeholder="Brief description for product cards"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="Complete product details"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fabric">Fabric / Material</Label>
                <Input
                  id="fabric"
                  value={formData.fabric}
                  onChange={(e) => updateFormData({ fabric: e.target.value })}
                  placeholder="e.g., Pure Silk"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="care">Care Instructions</Label>
                <Input
                  id="care"
                  value={formData.care_instructions}
                  onChange={(e) => updateFormData({ care_instructions: e.target.value })}
                  placeholder="e.g., Dry clean only"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Primary Category *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(v) => updateFormData({ category_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Categories are managed by Ogura. Contact support to request new categories.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Occasion Tags</Label>
              <div className="flex flex-wrap gap-2">
                {['Wedding', 'Party', 'Casual', 'Festive', 'Office', 'Bridal'].map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant={formData.occasion_tags.includes(tag) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const newTags = formData.occasion_tags.includes(tag)
                        ? formData.occasion_tags.filter(t => t !== tag)
                        : [...formData.occasion_tags, tag];
                      updateFormData({ occasion_tags: newTags });
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Style Tags</Label>
              <div className="flex flex-wrap gap-2">
                {['Traditional', 'Contemporary', 'Fusion', 'Minimalist', 'Embroidered', 'Printed'].map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant={formData.style_tags.includes(tag) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const newTags = formData.style_tags.includes(tag)
                        ? formData.style_tags.filter(t => t !== tag)
                        : [...formData.style_tags, tag];
                      updateFormData({ style_tags: newTags });
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Selling Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => updateFormData({ price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mrp">MRP (₹)</Label>
                <Input
                  id="mrp"
                  type="number"
                  value={formData.original_price || ''}
                  onChange={(e) => updateFormData({ original_price: Number(e.target.value) || undefined })}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Size & Color Variants</Label>
              <p className="text-sm text-muted-foreground">
                Add product variants after creating the product. You can manage variants from the edit page.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dispatch">Dispatch Timeline (Days)</Label>
              <Input
                id="dispatch"
                type="number"
                value={formData.dispatch_days}
                onChange={(e) => updateFormData({ dispatch_days: Number(e.target.value) })}
                min={1}
                max={30}
              />
              <p className="text-xs text-muted-foreground">
                How many days to prepare the order for shipping
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Made to Order</Label>
                <p className="text-xs text-muted-foreground">
                  This product is custom-made for each order
                </p>
              </div>
              <Switch
                checked={formData.is_made_to_order}
                onCheckedChange={(v) => updateFormData({ is_made_to_order: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Returnable</Label>
                <p className="text-xs text-muted-foreground">
                  Customer can return this product
                </p>
              </div>
              <Switch
                checked={formData.is_returnable}
                onCheckedChange={(v) => updateFormData({ is_returnable: v })}
              />
            </div>
          </div>
        );

      case 6:
        const category = categories?.find(c => c.id === formData.category_id);
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                {formData.images[0] ? (
                  <img src={formData.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">{formData.title || 'Untitled Product'}</h2>
                <p className="text-muted-foreground">{formData.short_description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">₹{formData.price.toLocaleString()}</span>
                  {formData.original_price && (
                    <span className="text-muted-foreground line-through">
                      ₹{formData.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Category:</strong> {category?.name || 'Not selected'}</p>
                  <p><strong>Fabric:</strong> {formData.fabric || 'Not specified'}</p>
                  <p><strong>Dispatch:</strong> {formData.dispatch_days} days</p>
                  <p><strong>Made to Order:</strong> {formData.is_made_to_order ? 'Yes' : 'No'}</p>
                  <p><strong>Returnable:</strong> {formData.is_returnable ? 'Yes' : 'No'}</p>
                </div>
                {formData.occasion_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.occasion_tags.map(tag => (
                      <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleSaveDraft} disabled={isCreating}>
                Save as Draft
              </Button>
              <Button onClick={handleSubmit} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit for Review'
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/seller/products')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">Step {currentStep} of 6</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={cn(
              'flex-1 h-2 rounded-full transition-colors',
              step.id <= currentStep ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      {currentStep < 6 && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SellerAddProduct;
