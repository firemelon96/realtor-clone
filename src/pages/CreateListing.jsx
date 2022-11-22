import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import {v4 as uuid} from 'uuid';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import {db} from '../firebase';
import {useNavigate} from 'react-router-dom';


function CreateListing() {
    const navigate = useNavigate();
    const auth = getAuth();
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: true,
        furnished: false,
        address: '',
        description: '',
        offer: false,
        regularPrice: 1000,
        discountedPrice: 0,
        lat: 0,
        long: 0,
        images: {}
    });
    const {type, name, bedrooms, bathrooms, parking, furnished, address, description, offer, regularPrice, discountedPrice, lat, long, images } = formData;
    function onChange(e){
        let boolean = null;
        if(e.target.value === 'true'){
            boolean = true;
        }
        if(e.target.value === 'false'){
            boolean = false;
        }
        //files
        if(e.target.files){
            setFormData((prevState)=>({
                ...prevState,
                images: e.target.files
            }))
        }
        //text / boolean / number
        if(!e.target.files){
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }))
        }
        
    }

    async function onSubmit(e){
        e.preventDefault();
        setLoading(true);
        if(+discountedPrice > +regularPrice){
            setLoading(false);
            toast.error(`Discounted price need to be less than regular price`);
            return;
        } 
        if(images.length > 6){
            setLoading(false);
            toast.error(`Maximum 6 images are allowed`);
            return;
        }
        let geolocation = {}
        let location
        if(geolocationEnabled){
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`);

            const data = await response.json();
            console.log(data);
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

            location = data.status === 'ZERO RESULTS' && undefined;

            if(location === undefined){
                setLoading(false);
                toast.error(`Please enter a correct address`);
                return;
            }
        }else{
            geolocation.lat = lat;
            geolocation.lng = long;
        }

        async function storeImage(image){
            return new Promise((resolve, reject)=>{
                const storage = getStorage();
                const filename = `${auth.currentUser.uid}-${image.name}-${uuid()}`;
                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on('state_changed', (snapshot)=>{
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes)* 100;
                    console.log(`Upload is ${progress} done`);
                    switch (snapshot.state) {
                        case 'paused':
                          console.log('Upload is paused');
                          break;
                        case 'running':
                          console.log('Upload is running');
                          break;
                        default:
                      }
                }, (error)=>{
                    reject(error);
                    console.log(error)
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                        resolve(downloadUrl);
                    });
                });
            });
        }
        
    const imgUrls = await Promise.all(
        [...images].map((image)=>storeImage(image))).catch((error)=>{
            setLoading(false);
            toast.error(`Images not uploaded`);
            return;
        });
        
        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid
        }
        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        delete formDataCopy.lat;
        delete formDataCopy.long;
        const docRef = await addDoc(collection(db, "listings"), formDataCopy);
        setLoading(false);
        toast.success('Listing created');
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }


    if(loading){
        return <Spinner/>
    }
  return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className='text-3xl text-center mt-6 font-bold'>Create Listing</h1>
        <form onSubmit={onSubmit}>
            <p className='text-lg mt-6 font-semibold '>Sell / Rent</p>
            <div className='flex'>
                <button className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === `rent` ? `bg-white text-black`: `bg-slate-600 text-white`}`} type='button' id='type' value='sale' onClick={onChange}>Sell</button>
                <button className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === `sale` ? `bg-white text-black`: `bg-slate-600 text-white`}`} type='button' id='type' value='rent' onClick={onChange}>rent</button>
            </div>
            <p className='text-lg mt-6 font-semibold '>Name / Title</p>
            <input className='w-full rounded px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 ' type="text" id='name' value={name} onChange={onChange} placeholder='Name' maxLength='32' minlength='10' required/>
            <div className='flex space-x-6 justify-start mb-6'>
                <div >
                    <p className='text-lg font-semibold'>Beds</p>
                    <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' type="number" id="bedrooms" value={bedrooms} onChange={onChange} min='1' max='50' required/>
                </div>
                <div >
                    <p className='text-lg font-semibold'>Baths</p>
                    <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' type="number" id="bathrooms" value={bathrooms} onChange={onChange} min='1' max='50' required/>
                </div>
            </div>
            <p className='text-lg mt-6 font-semibold '>Parking spot</p>
            <div className='flex'>
                <button className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!parking ? `bg-white text-black`: `bg-slate-600 text-white`}`} type='button' id='parking' value={true} onClick={onChange}>Yes</button>
                <button className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${parking ? `bg-white text-black`: `bg-slate-600 text-white`}`} type='button' id='parking' value={false} onClick={onChange}>No</button>
            </div>
            <p className='text-lg mt-6 font-semibold '>Furnished</p>
            <div className='flex'>
                <button className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!furnished ? `bg-white text-black`: `bg-slate-600 text-white`}`} type='button' id='furnished' value={true} onClick={onChange}>yes</button>
                <button className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${furnished ? `bg-white text-black`: `bg-slate-600 text-white`}`} type='button' id='furnished' value={false} onClick={onChange}>no</button>
            </div>
            <p className='text-lg mt-6 font-semibold '>Address</p>
            <textarea className='w-full rounded px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 ' type="text" id='address' value={address} onChange={onChange} placeholder='Address' required/>
            {!geolocationEnabled && (
                <div className='flex space-x-6 justify-start mb-6'>
                    <div>
                        <p className='text-lg font-semibold'>Latitude</p>
                        <input type="number" id="lat" value={lat} onChange={onChange} min='-90' max='90' required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'/>
                    </div>
                    <div>
                        <p className='text-lg font-semibold'>Longitude</p>
                        <input type="number" id="long" value={long} onChange={onChange} min='-180' max='180' required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'/>
                    </div>
                </div>
            )}
            <p className='text-lg font-semibold '>Description</p>
            <textarea className='w-full rounded px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 ' type="text" id='description' value={description} onChange={onChange} placeholder='Description' required/>
            <p className='text-lg font-semibold '>Offer</p>
            <div className='flex mb-6'>
                <button className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!offer ? `bg-white text-black`: `bg-slate-600 text-white`}`} type='button' id='offer' value={true} onClick={onChange}>yes</button>
                <button className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${offer ? `bg-white text-black`: `bg-slate-600 text-white`}`} type='button' id='offer' value={false} onClick={onChange}>no</button>
            </div>
            <div className='flex items-center mb-6'>
                <div>
                    <p className='text-lg font-semibold'>Regular price</p>
                    <div className='flex space-x-6'>
                    <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' type="number" id="regularPrice" value={regularPrice} onChange={onChange} min='1000' max='500000000' required/>
                    {type === `rent` && (
                        <div>
                            <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
                        </div>
                    )}
                    </div>
                </div>
            </div>
            {offer && (
                <div className='flex items-center mb-6'>
                <div>
                    <p className='text-lg font-semibold'>Discounted price</p>
                    <div className='flex space-x-6'>
                    <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' type="number" id="discountedPrice" value={discountedPrice} onChange={onChange} min='1000' max='500000000' required={offer}/>
                    {type === `rent` && (
                        <div>
                            <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
                        </div>
                    )}
                    </div>
                </div>
            </div>
            )}
            <div className='mb-6'>
                <p className='text-xl font-semibold'>Images</p>
                <p className='text-gray-600 '>The first image will be the cover (max 6)</p>
                <input type="file" id="images" onChange={onChange} accept='.jpg,.png,.jpeg' multiple required className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600'/>
            </div>
            <button type="submit" className='mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>Create Listing</button>
        </form>
    </main>
  )
}

export default CreateListing