import React, { useState } from 'react';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Cloudinary } from '@cloudinary/url-gen';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import './darkMode.css'; // Import the custom dark mode styles

export default function CreatePost() {
  const cld = new Cloudinary({ cloud: { cloudName: 'dqnuqzbyk' } });
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState('');
  const [formData, setFormData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [publishError, setPublishError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for toggling dark mode

  const navigate = useNavigate();

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
        costing: ['Yarn realization', 'Count conversion costing', 'Store consumption costing'],
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !imageFileUrl) {
      console.warn('Validation failed:', formData);
      setPublishError('Please fill all required fields.');
      return;
    }

    // Ensure imageUrl is part of the formData before submission
    const formWithImageUrl = { ...formData, image: imageFileUrl };

    console.log('Form data before submission:', formWithImageUrl);
    console.log('Complete form data:', { ...formData, imageUrl: imageFileUrl });

    try {
      const res = await fetch('http://localhost:5173/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formWithImageUrl),
      });
      const data = await res.json();

      console.log('Response:', data);

      if (!res.ok) {
        setPublishError(data.message || 'Failed to publish post.');
        return;
      }

      setPublishError(null);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      console.error('Error during form submission:', error);
      setPublishError('Something went wrong.');
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!file) {
      console.error('No file selected for upload.');
      setImageUploadError('Please select an image to upload.');
      return;
    }

    console.log('Uploading file:', file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'nj8ouwoc');
    formData.append('cloudname', 'dqnuqzbyk');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/dqnuqzbyk/image/upload', true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setImageUploadProgress(progress);
      }
    };

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Cloudinary Response:', data);
        setImageFileUrl(data.secure_url);
        setFormData((prev) => ({ ...prev, image: data.secure_url }));
        setImageUploadError(null);
      } else {
        setImageUploadError('Failed to upload image.');
      }
    };

    xhr.onerror = () => {
      setImageUploadError('An error occurred while uploading the image.');
    };

    xhr.send(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className={`p-3 max-w-3xl mx-auto min-h-screen ${isDarkMode ? 'dark' : ''}`}>
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
          onChange={(e) => setFormData({ ...formData, articleType: e.target.value })}
        >
          <option value="Others">Select Article Type</option>
          <option value="Machines">Machines</option>
          <option value="MOP">MOP</option>
          <option value="Manual">Manual</option>
          <option value="Formulas">Formulas</option>
        </Select>

        {/* Product Dropdown */}
        <Select
          onChange={(e) => {
            const value = e.target.value;
            console.log('Selected Category:', value);
            setSelectedCategory(value);
            handleInputChange('product', value);
            setSelectedSubCategory('');
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
              console.log('Selected Subcategory:', value);
              setSelectedSubCategory(value);
            }}
          >
            <option value="">Select Subcategory</option>
            {product[selectedCategory]?.types[Object.keys(product[selectedCategory].types)[0]].map((subCategory) => (
              <option key={subCategory} value={subCategory}>
                {subCategory}
              </option>
            ))}
          </Select>
        )}

        {/* ReactQuill Editor */}
        <ReactQuill
          value={formData.content || ''}
          onChange={(value) => handleInputChange('content', value)}
          className="mb-3"
        />

        {/* File Upload */}
        <div className="relative">
          <FileInput
            id="fileInput"
            required
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <Button
            onClick={uploadImageToCloudinary}
            disabled={imageUploadProgress > 0 && imageUploadProgress < 100}
          >
            Upload Image
          </Button>
          {imageUploadProgress > 0 && imageUploadProgress < 100 && (
            <CircularProgressbar
              value={imageUploadProgress}
              text={`${imageUploadProgress}%`}
              styles={buildStyles({
                pathColor: '#4db8ff',
                textColor: '#fff',
                trailColor: '#d6d6d6',
                backgroundColor: '#f4f4f4',
              })}
            />
          )}
        </div>

        {/* Error Handling */}
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {publishError && <Alert color="failure">{publishError}</Alert>}

        {/* Submit Button */}
        <Button type="submit">Publish</Button>
      </form>
    </div>
  );
}
