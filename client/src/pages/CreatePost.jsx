import React, { useState } from 'react';
import { Alert, Button, FileInput, Select, TextInput, Progress, Textarea } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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

  // RAG States
  const [pdfFile, setPdfFile] = useState(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfUploadMessage, setPdfUploadMessage] = useState(null);
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [aiGenerateError, setAiGenerateError] = useState(null);
  const [aiArticleLength, setAiArticleLength] = useState('Medium');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');

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

    if (!formData.title || !formData.content) {
      setPublishError('Please fill all required fields.');
      return;
    }

    const payload = {
      ...formData,
    };
    if (imageFileUrl) {
      payload.image = imageFileUrl;
    }

    try {
      const res = await fetch('/api/post/create', {
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

  const handleUploadPdf = async () => {
    if (!pdfFile) {
      setPdfUploadMessage({ type: 'failure', text: 'Please select a PDF file first.' });
      return;
    }

    setIsUploadingPdf(true);
    setPdfUploadMessage(null);

    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      const res = await fetch('http://localhost:5000/api/pdf/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setPdfUploadMessage({ type: 'failure', text: data.message || 'Failed to upload PDF.' });
      } else {
        setPdfUploadMessage({ type: 'success', text: 'PDF successfully processed and indexed!' });
      }
    } catch (error) {
      setPdfUploadMessage({ type: 'failure', text: 'Server error while uploading PDF.' });
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!aiTopic) {
      setAiGenerateError('Please enter a topic for AI generation.');
      return;
    }

    setIsGeneratingContent(true);
    setAiGenerateError(null);

    try {
      const res = await fetch('http://localhost:5000/api/rag/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: aiTopic,
          articleLength: aiArticleLength,
          customPrompt: aiCustomPrompt
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAiGenerateError(data.message || 'Failed to generate content.');
      } else {
        // Populate ReactQuill and Title
        handleInputChange('content', data.data.content);
        if (!formData.title) {
          handleInputChange('title', aiTopic);
        }
      }
    } catch (error) {
      setAiGenerateError('Server error while generating content.');
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`p-3 max-w-3xl mx-auto min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>

      {/* Dark mode toggle */}
      <Button className="mb-4" onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </Button>

      {/* AI Generator Panel */}
      <div className="mb-8 p-4 border-2 border-purple-400 border-dashed rounded-lg bg-purple-50 dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-400">🤖 AI Content Generator</h2>
        
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <FileInput accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
            <Button 
              type="button" 
              gradientDuoTone="purpleToBlue" 
              onClick={handleUploadPdf}
              disabled={isUploadingPdf}
            >
              {isUploadingPdf ? 'Indexing...' : 'Upload & Index PDF'}
            </Button>
          </div>
          {pdfUploadMessage && (
            <Alert color={pdfUploadMessage.type}>{pdfUploadMessage.text}</Alert>
          )}

          <div className="flex gap-4 items-center mt-2">
            <Select value={aiArticleLength} onChange={(e) => setAiArticleLength(e.target.value)}>
              <option value="Short">Short</option>
              <option value="Medium">Medium</option>
              <option value="Long">Long</option>
            </Select>
            <TextInput 
              placeholder="Enter topic to generate blog..." 
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="button" 
              gradientDuoTone="pinkToOrange" 
              onClick={handleGenerateContent}
              disabled={isGeneratingContent}
            >
              {isGeneratingContent ? 'Generating...' : 'Generate Post'}
            </Button>
          </div>
          <Textarea 
            placeholder="Optional custom instructions (e.g., 'Make it sound professional', 'Focus on section 3')"
            value={aiCustomPrompt}
            onChange={(e) => setAiCustomPrompt(e.target.value)}
            rows={2}
          />
          {aiGenerateError && <Alert color="failure">{aiGenerateError}</Alert>}
        </div>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Title"
          required
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />

        <Select
          value={formData.articleType || ''}
          onChange={(e) => handleInputChange('articleType', e.target.value)}
        >
          <option value="Others">Select Article Type</option>
          <option value="Machines">Machines</option>
          <option value="MOP">MOP</option>
          <option value="Manual">Manual</option>
          <option value="Formulas">Formulas</option>
        </Select>

        {/* Product Dropdown */}
        <Select
          value={selectedCategory}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCategory(value);
            handleInputChange('product', value);
            setSelectedSubCategory('');
            handleInputChange('category', '');
            handleInputChange('department', '');
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
            value={selectedSubCategory}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedSubCategory(value);
              handleInputChange('category', value);
              handleInputChange('department', '');
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
            value={formData.department || ''}
            onChange={(e) => handleInputChange('department', e.target.value)}
          >
            <option value="">Select</option>
            {product[selectedCategory]?.types[selectedSubCategory]?.map((suboption) => (
              <option key={suboption} value={suboption}>
                {suboption}
              </option>
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
          <Progress progress={imageUploadProgress} size="lg" textLabel="Uploading..." labelProgress={true} />
        )}

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {publishError && <Alert color="failure">{publishError}</Alert>}

        <Button type="submit">Publish</Button>
      </form>
    </div>
  );
}
