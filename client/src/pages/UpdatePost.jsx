import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUrl, setImageFileUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [publishError, setPublishError] = useState(null);

  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

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
          'Humidifcation plant',
          'Compressor',
          'Yarn conditioning',
        ],
        costing: ['Yarn realisation', 'Count conversion costing', 'Store cosumption costing'],
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          const post = data.posts[0];
          setFormData(post);

          // Set selected category and subcategory
          setSelectedCategory(post.product || '');
          setSelectedSubCategory(post.category || '');
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPost();
  }, [postId]);

  const uploadImageToCloudinary = () => {
    if (!file) {
      setImageUploadError('Please select an image');
      return;
    }
    setImageUploadError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'nj8ouwoc');
    formData.append('cloudname', 'dqnuqzbyk'); // Replace with your Cloudinary cloud name

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setImageUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setFormData((prevState) => ({
          ...prevState,
          image: response.secure_url,
        }));
        setImageUploadProgress(null);
        setImageUploadError(null);
      } else {
        setImageUploadError('Image upload failed');
        setImageUploadProgress(null);
      }
    };

    xhr.onerror = () => {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
    };

    xhr.open('POST', 'https://api.cloudinary.com/v1_1/dqnuqzbyk/image/upload');
    xhr.send(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
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

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update Post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
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
            {product[selectedCategory].types[selectedSubCategory].map((suboption) => (
              <option key={suboption} value={suboption}>
                {suboption}
              </option>
            ))}
          </Select>
        )}
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={uploadImageToCloudinary}
            disabled={imageUploadProgress !== null}
          >
            {imageUploadProgress !== null ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img src={formData.image} alt='Uploaded' className='mt-3 w-40' />
        )}

        <div>
          <ReactQuill
            theme="snow"
            value={formData.content || ''}
            onChange={(content) => handleInputChange('content', content)}
            placeholder="Enter post content"
          />
        </div>

        {publishError && <Alert color='failure'>{publishError}</Alert>}

        <Button type='submit' gradientDuoTone='greenToBlue' disabled={imageUploadProgress !== null}>
          Update Post
        </Button>
      </form>
    </div>
  );
}
