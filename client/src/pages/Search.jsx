import { Button, Select } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const product = {
  'Fibre Manufacturing': {
    types: {
      Type: ['Natural fibre', 'Manmade fibre'],
      Process: [],
    },
  },
  'Yarn Manufacturing': {
    types: {
      'Ring Spinning': [
        'Mixing',
        'Blowroom',
        'Carding',
        'Breaker Drawframe',
        'Lapformer',
        'Comber',
        'Finisher Drawframe',
        'Speedframe',
        'Ringframe',
        'Autoconer',
      ],
      'Open End Spinning': ['Mixing', 'Blowroom', 'Carding', 'Finisher Drawframe'],
      'Air Jet Spinning': ['Mixing', 'Blowroom', 'Carding', 'Finisher Drawframe'],
      Accessories: [
        'Wire clothing',
        'Cots',
        'Apron',
        'Rings & Traveller',
        'Bobbin transport',
        'OHTC',
        'Yarn clearers',
        'WCS Plant',
        'Humidification plant',
        'Compressor',
        'Yarn conditioning',
      ],
      Costing: ['Yarn realisation', 'Count conversion costing', 'Store consumption costing'],
    },
  },
  'Fabric Manufacturing': {
    types: {
      Knitting: [],
      Weaving: ['Warping', 'Sizing', 'Looms'],
      Garmenting: ['Scouring', 'Finishing', 'Cutting', 'Sewing'],
    },
  },
};

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    product: 'nil',
    category: 'uncategorized',
    department: 'not selected',
    articleType: 'Others',
  });

  const [subCategories, setSubCategories] = useState([]);
  const [types, setTypes] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prev) => ({ ...prev, [id]: value }));
  };

  const handleProductChange = (e) => {
    const selectedProduct = e.target.value;
    setSidebarData((prev) => ({ ...prev, product: selectedProduct, category: '', department: '' }));
    setSubCategories(Object.keys(product[selectedProduct]?.types || {}));
    setTypes([]);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const typesForCategory = product[sidebarData.product]?.types[selectedCategory] || [];
    setSidebarData((prev) => ({ ...prev, category: selectedCategory, department: '' }));
    setTypes(typesForCategory);
  };

  const handleTypeChange = (e) => {
    setSidebarData((prev) => ({ ...prev, department: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    for (const [key, value] of Object.entries(sidebarData)) {
      urlParams.set(key, value);
    }
    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    console.log('Sidebar Data:', sidebarData);
    console.log('Subcategories:', subCategories);
    console.log('Types:', types);
  }, [sidebarData, subCategories, types]);

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Product:</label>
            <Select id='product' value={sidebarData.product} onChange={handleProductChange}>
              <option value='nil'>Select Product</option>
              {Object.keys(product).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </Select>
          </div>

          {subCategories.length > 0 && (
            <div className='flex items-center gap-2'>
              <label className='font-semibold'>Category:</label>
              <Select id='category' value={sidebarData.category} onChange={handleCategoryChange}>
                <option value='uncategorized'>Select Category</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {types.length > 0 && (
            <div className='flex items-center gap-2'>
              <label className='font-semibold'>Department:</label>
              <Select id='department' value={sidebarData.department} onChange={handleTypeChange}>
                <option value='not selected'>Select Department</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Article Type:</label>
            <Select id='articleType' value={sidebarData.articleType} onChange={handleChange}>
              <option value='Others'>Select Article Type</option>
              <option value='Machines'>Machines</option>
              <option value='MOP'>MOP</option>
              <option value='Manual'>Manual</option>
              <option value='Formulas'>Formulas</option>
            </Select>
          </div>

          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Apply Filters
          </Button>
        </form>
      </div>

      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>
          Posts results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {/* Render posts here */}
        </div>
      </div>
    </div>
  );
}
