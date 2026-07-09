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

      {/* AI Assistant Panel */}
      <div className="mb-8 p-6 bg-slate-150/40 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-1 bg-indigo-50 dark:bg-indigo-950/60 rounded text-indigo-600 dark:text-indigo-400">
            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3.096 15H3l5.096-.813L9 9l.813 5.096L15 14.904v.192l-5.187.808z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929l-.707 1.838-.707-1.838-.707-.707 1.838-.707.707 1.838.707-1.838.707.707-1.838.707z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Gemini Editorial Draft Assistant</h2>
        </div>
        
        <div className="flex flex-col gap-5 text-sm">
          {/* Step 1: Document Indexer */}
          <div className="flex flex-col gap-2 p-4 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-lg">
            <label className="font-semibold text-slate-700 dark:text-slate-350 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 flex items-center justify-center text-xs">1</span>
              Load Source Document (PDF)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mt-1">
              <div className="flex-1">
                <FileInput accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
              </div>
              <Button 
                type="button" 
                color="indigo"
                onClick={handleUploadPdf}
                disabled={isUploadingPdf}
                className="font-semibold text-xs py-0.5"
              >
                {isUploadingPdf ? 'Processing PDF...' : 'Index Document'}
              </Button>
            </div>
            {pdfUploadMessage && (
              <Alert className="mt-2 text-xs" color={pdfUploadMessage.type === 'success' ? 'success' : 'failure'}>
                {pdfUploadMessage.text}
              </Alert>
            )}
          </div>

          {/* Step 2: Content Generation Options */}
          <div className="flex flex-col gap-3 p-4 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-lg">
            <label className="font-semibold text-slate-700 dark:text-slate-350 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 flex items-center justify-center text-xs">2</span>
              Generate Article Draft
            </label>

            <div className="flex flex-col md:flex-row gap-3 mt-1">
              {/* Length Selector */}
              <div className="w-full md:w-36">
                <Select value={aiArticleLength} onChange={(e) => setAiArticleLength(e.target.value)}>
                  <option value="Short">Short (~500w)</option>
                  <option value="Medium">Medium (~1000w)</option>
                  <option value="Long">Long (~1500w+)</option>
                </Select>
              </div>

              {/* Topic Input */}
              <div className="flex-grow">
                <TextInput 
                  placeholder="E.g., Carding machine speeds or Raw cotton blending ratios..." 
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                />
              </div>

              {/* Generate Button */}
              <Button 
                type="button" 
                color="indigo"
                onClick={handleGenerateContent}
                disabled={isGeneratingContent}
                className="font-semibold text-xs"
              >
                {isGeneratingContent ? 'Drafting...' : 'Generate Article'}
              </Button>
            </div>

            {/* Custom Instructions */}
            <div className="mt-2">
              <Textarea 
                placeholder="Optional style directions (e.g., 'Write in a professional tone, focus on mechanical safety standards')"
                value={aiCustomPrompt}
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                rows={2}
                className="text-xs"
              />
            </div>

            {/* Prompt presets */}
            <div className="flex flex-wrap gap-1.5 items-center mt-1">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Quick suggestions:</span>
              {[
                "Write in a highly professional technical tone",
                "Structure as a step-by-step operation manual",
                "Compare standard configurations and speeds",
                "Explain chemical parameters and temperature targets"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setAiCustomPrompt(suggestion)}
                  className="text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  {suggestion.slice(0, 30)}...
                </button>
              ))}
            </div>
            
            {aiGenerateError && <Alert className="mt-2 text-xs" color="failure">{aiGenerateError}</Alert>}
          </div>
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

        <div className='flex gap-4 items-center justify-between border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/50'>
          <FileInput accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <Button
            type="button"
            color="indigo"
            size="sm"
            outline
            disabled={imageUploadProgress > 0 && imageUploadProgress < 100}
            onClick={uploadImageToCloudinary}>
            Upload Image
          </Button>
        </div>

        {imageUploadProgress > 0 && (
          <Progress progress={imageUploadProgress} size="sm" color="blue" labelProgress={true} />
        )}

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        
        {formData.image && (
          <div className='flex flex-col items-start gap-2 mt-2 p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-900/30'>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Cover Image Preview</span>
            <img src={formData.image} alt='Uploaded' className='w-48 object-cover rounded-lg' />
            <Button 
              type='button' 
              color='failure' 
              size='xs' 
              outline
              onClick={() => {
                handleInputChange('image', '');
                setFile(null);
              }}
            >
              Remove Image
            </Button>
          </div>
        )}

        {publishError && <Alert color="failure">{publishError}</Alert>}

        <Button type="submit" color="indigo" className="mt-4 font-semibold">Publish Article</Button>
      </form>
    </div>
  );
}
