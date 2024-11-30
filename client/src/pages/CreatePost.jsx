import React, { useState } from 'react';
import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput,
} from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

  // Product data with suboptions for suboptions
  const product = {
    'Fibre Manufacturing': {
      types: {
        Type: ['Natural fibre', 'Manmade fibre'],
        Process: [],
      },
    },
    'Yarn Manufacturing': {
      types: {
        'Ring Spinning': ['Mixing', 'Blowroom','Carding' , 'Breaker Drawframe','Lapformer','Comber','Finisher Drawframe','Speedframe','Ringframe','Autoconer'],
        'Open End Spinning': ['Mixing', 'Blowroom','Carding','Finisher Drawframe'],
        'Air Jet Spinning': ['Mixing','Blowroom','Carding','Finisher Drawframe'],
         'Accessories' : ['Wire clothing','Cots','Apron','Rings & Traveller','Bobbin transport','OHTC','Yarn clearers','WCS Plant','Humidifcation plant','Compressor','Yarn conditioning'],
         'costing' : ['Yarn realisation' , 'Count conversion costing','Store cosumption costing'],
        },
    },
    'Fabric Manufacturing': {
      types: {
        Knitting: [],
        Weaving: ['Warping', 'Sizing', 'Looms'],
        Garmenting: ['Scouring', 'Finishing','Cutting','Sewing'],
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError('Something went wrong.');
    }
  };

  // General handler for state updates
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title Input */}
        <TextInput
          type="text"
          placeholder="Title"
          required
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
           <Select
            onChange={(e) =>
              setFormData({ ...formData, articleType: e.target.value })
            }
          >
            <option value='Others'>Select Article Type</option>
            <option value='Machines'>Machines</option>
            <option value='MOP'>MOP</option>
            <option value='Manual'>Manual</option>
            <option value='Formulas'>Formulas</option>
         
          </Select>

        {/* Product Dropdown */}
        <Select
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCategory(value);
            handleInputChange('product', value);
            setSelectedSubCategory(''); // Reset subcategory when product changes
          }}
        >
          <option value="">Select Product</option>
          {Object.keys(product).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>

        {/* Subcategory Dropdown */}
        {selectedCategory && (
          <Select
            onChange={(e) => {
              const value = e.target.value;
              setSelectedSubCategory(value);
              handleInputChange('category', value);
            }}
          >
            <option value="">Select Product Category</option>
            {Object.keys(product[selectedCategory].types).map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </Select>
        )}

        {/* Suboption of Subcategory Dropdown */}
        {selectedSubCategory && (
          <Select
            onChange={(e) => handleInputChange('department', e.target.value)}
          >
            <option value="">Select</option>
            {product[selectedCategory].types[selectedSubCategory].map(
              (suboption) => (
                <option key={suboption} value={suboption}>
                  {suboption}
                </option>
              )
            )}
          </Select>
        )}

        {/* Image Upload */}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button type="button" size="sm" onClick={() => {}}>
            Upload Image
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        {/* Rich Text Editor */}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          required
          onChange={(value) => handleInputChange('content', value)}
        />

        {/* Submit Button */}
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>

        {/* Error Alert */}
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
