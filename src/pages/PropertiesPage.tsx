
import { useState, useEffect } from 'react';
import { Building, Home, Store, Filter, Grid, List } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock Property Data
const mockProperties = [
  {
    id: 1,
    title: "Modern Luxury Apartment",
    type: "apartment",
    mode: "rent",
    price: 2500000,
    currency: "₦",
    location: "Downtown, Lagos",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    featured: true,
    image: "https://source.unsplash.com/photo-1518005020951-eccb494ad742"
  },
  {
    id: 2,
    title: "Corporate Office Space",
    type: "office",
    mode: "lease",
    price: 5000000,
    currency: "₦",
    location: "Business District, Abuja",
    area: 2500,
    featured: false,
    image: "https://source.unsplash.com/photo-1497604401993-f2e922e5cb0a"
  },
  {
    id: 3,
    title: "Spacious Family Home",
    type: "house",
    mode: "buy",
    price: 450000000,
    currency: "₦",
    location: "Suburban Area, Lagos",
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    featured: true,
    image: "https://source.unsplash.com/photo-1518877593221-1f28583780b4"
  },
  {
    id: 4,
    title: "Studio Apartment",
    type: "apartment",
    mode: "rent",
    price: 1200000,
    currency: "₦",
    location: "University Area, Ibadan",
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    featured: false,
    image: "https://source.unsplash.com/photo-1493962853295-0fd70327578a"
  },
  {
    id: 5,
    title: "Retail Space",
    type: "commercial",
    mode: "lease",
    price: 3500000,
    currency: "₦",
    location: "Shopping District, Port Harcourt",
    area: 1800,
    featured: false,
    image: "https://source.unsplash.com/photo-1460574283810-2aab119d8511"
  },
  {
    id: 6,
    title: "Waterfront Villa",
    type: "house",
    mode: "buy",
    price: 1200000000,
    currency: "₦",
    location: "Coastal Area, Lagos",
    bedrooms: 5,
    bathrooms: 4,
    area: 4200,
    featured: true,
    image: "https://source.unsplash.com/photo-1527576539890-dfa815648363"
  }
];

const PropertyCard = ({ property }: { property: any }) => (
  <Card className="overflow-hidden h-full animate-fade-in hover-scale">
    <div className="relative h-48 overflow-hidden">
      <img 
        src={property.image} 
        alt={property.title} 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
      />
      <div className="absolute top-2 right-2">
        <span className={`px-2 py-1 text-xs font-bold rounded ${
          property.mode === 'rent' ? 'bg-blue-500 text-white' : 
          property.mode === 'buy' ? 'bg-green-500 text-white' : 
          'bg-purple-500 text-white'
        }`}>
          {property.mode.toUpperCase()}
        </span>
      </div>
    </div>
    <CardHeader className="p-4">
      <CardTitle className="line-clamp-1">{property.title}</CardTitle>
      <CardDescription>{property.location}</CardDescription>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <div className="flex items-center justify-between text-sm">
        <span>{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
        <span>{property.area} sq ft</span>
      </div>
      {(property.bedrooms || property.bathrooms) && (
        <div className="flex items-center justify-between mt-2 text-sm">
          {property.bedrooms && <span>{property.bedrooms} Beds</span>}
          {property.bathrooms && <span>{property.bathrooms} Baths</span>}
        </div>
      )}
    </CardContent>
    <CardFooter className="p-4 flex justify-between items-center border-t">
      <div className="font-bold text-lg">{property.currency}{property.price.toLocaleString()}</div>
      <Button variant="outline" size="sm" className="story-link">View Details</Button>
    </CardFooter>
  </Card>
);

const PropertiesPage = () => {
  const [activeMode, setActiveMode] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  
  useEffect(() => {
    let filtered = [...mockProperties];
    
    if (activeMode !== 'all') {
      filtered = filtered.filter(property => property.mode === activeMode);
    }
    
    if (activeType !== 'all') {
      filtered = filtered.filter(property => property.type === activeType);
    }
    
    setFilteredProperties(filtered);
  }, [activeMode, activeType]);
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">Properties</h1>
        <p className="text-muted-foreground">Browse our curated selection of properties for rent, sale, and lease.</p>
      </div>
      
      <div className="mb-8">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveMode}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="rent" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Rent
              </TabsTrigger>
              <TabsTrigger value="buy" className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                Buy
              </TabsTrigger>
              <TabsTrigger value="lease" className="flex items-center gap-1">
                <Store className="h-4 w-4" />
                Lease
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Property Type
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setActiveType('all')}>All Types</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveType('apartment')}>Apartments</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveType('house')}>Houses</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveType('office')}>Office Spaces</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveType('commercial')}>Commercial</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex border rounded-md">
                <Button 
                  variant={viewMode === 'grid' ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-0">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No properties found matching your criteria.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rent" className="mt-0">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No rental properties found.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="buy" className="mt-0">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No properties for sale found.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="lease" className="mt-0">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No properties for lease found.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertiesPage;
