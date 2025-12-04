import React, { useState } from 'react';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import './darkMode.css';

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState('');
  const [formData, setFormData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [publishError, setPublishError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
        Accessories: ['Wire clothing', 'Cots', 'Apron', 'Rings & Traveller'],
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
      setPublishError('Please fill all required fields.');
      return;
    }

    const payload = {
      ...formData,
      image: imageFileUrl,
      subCategory: selectedSubCategory,
    };

    try {
      const res = await fetch('http://localhost:3000/api/post/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message || 'Failed to publish post.');
        return;
      }

      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError('Something went wrong.');
    }
  };

  const uploadImageToCloudinary = () => {
    if (!file) {
      setImageUploadError('Please select an image');
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'nj8ouwoc'); // Correct
    setImageUploadError(null);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/dqnuqzbyk/image/upload');

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setImageUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        setImageFileUrl(res.secure_url);
        setFormData((prev) => ({ ...prev, image: res.secure_url }));
      } else setImageUploadError('Failed uploading image.');
    };

    xhr.onerror = () => setImageUploadError('Upload failed.');
    xhr.send(data);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className={`p-3 max-w-3xl mx-auto min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>

      {/* Dark mode toggle */}
      <Button className="mb-4" onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </Button>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Title"
          required
          onChange={(e) => handleInputChange('title', e.target.value)}
        />

        <Select onChange={(e) => handleInputChange('articleType', e.target.value)}>
          <option value="">Select Article Type</option>
          <option value="Machines">Machines</option>
          <option value="MOP">MOP</option>
          <option value="Manual">Manual</option>
          <option value="Formulas">Formulas</option>
        </Select>

        <Select
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            handleInputChange('product', e.target.value);
            setSelectedSubCategory('');
          }}>
          <option value="">Select Product</option>
          {Object.keys(product).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Select>

        {/* Dynamic Subcategory */}
        {selectedCategory && (
          <Select
            onChange={(e) => setSelectedSubCategory(e.target.value)}>
            <option value="">Select Subcategory</option>
            {Object.values(product[selectedCategory].types).flat().map((sub) => (
              <option key={sub}>{sub}</option>
            ))}
          </Select>
        )}

        <ReactQuill
          value={formData.content || ''}
          onChange={(value) => handleInputChange('content', value)}
        />

        <FileInput onChange={(e) => setFile(e.target.files[0])} />

        <Button
          type="button"
          disabled={imageUploadProgress > 0 && imageUploadProgress < 100}
          onClick={uploadImageToCloudinary}>
          Upload Image
        </Button>

        {imageUploadProgress > 0 && (
          <CircularProgressbar
            value={imageUploadProgress}
            text={`${imageUploadProgress}%`}
            styles={buildStyles({ pathColor: '#3498db' })}
          />
        )}

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {publishError && <Alert color="failure">{publishError}</Alert>}

        <Button type="submit">Publish</Button>
      </form>
    </div>
  );
}
