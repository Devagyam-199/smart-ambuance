import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from "lucide-react"; // Import eye icons (optional)
import { Link, useNavigate } from 'react-router-dom';

const UserSignup = () => {
    const [isSignedup, setIsSignedUp] = useState(false);

    /* dynamic user location fetch */
    const [useAutoLocation, setUseAutoLocation] = useState(true);
    const [location, setLocation] = useState({
        latitude: "",
        longitude: "",
        address: "",
        city: "",
        state: "",
        country: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    /* user detail variables */
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');

    /* user credential variables*/
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('')

    /* user healthcare variables*/
    const [bloodGroup, setBloodGroup] = useState('')
    const [prevMedic, setPrevMedic] = useState('')
    const [alergies, setAlergies] = useState('');
    const [emergencyName, setEmergencyName] = useState('')
    const [emergencyNum, setEmergencyNum] = useState('')

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (number.length !== 10 || isNaN(number)) {
            alert('Invalid phone number. Please enter a 10-digit number.');
            setNumber('')
            return;
        }

        console.log(`Full Name: ${fullName},
                    Email: ${email},
                    Phone Number: ${number},
                    DOB: ${dob},
                    Gender: ${gender}.
                    Address: ${`${location.address},${location.city}`}`);

        setTimeout(() => {
            navigate('/login')
        }, 1000);
    };

    /* user location  fetch function */
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation((prev) => ({ ...prev, latitude, longitude }));

                    // Reverse Geocoding (Replace with your API)
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await response.json();

                    setLocation({
                        latitude,
                        longitude,
                        address: data.display_name || "",
                        city: data.address.city || data.address.town || "",
                        state: data.address.state || "",
                        country: data.address.country || "",
                    });
                },
                (error) => {
                    console.error("Error fetching location:", error);
                    alert("Please enable location services.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    useEffect(() => {
        if (useAutoLocation) {
            getUserLocation();
        }
    }, [useAutoLocation]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br font-poppins from-sky-200 via-sky-300 to-sky-700 w-full">
            <div className="h-auto my-10 lg:w-1/2 w-11/12 lg:rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden">
                <div className="w-full bg-white flex flex-col items-center p-8 gap-6">
                    <div className="flex items-center w-full gap-3 mb-4">
                        <svg fill="#00e0d1" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="69px" height="69px" viewBox="0 0 406.55 406.55" xml:space="preserve" stroke="#00e0d1">

                            <g id="SVGRepo_bgCarrier" stroke-width="0" />

                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

                            <g id="SVGRepo_iconCarrier"> <g> <g> <polygon points="293.548,181.031 275.398,181.031 275.398,203.801 253.097,203.801 253.097,221.939 275.398,221.939 275.398,244.708 293.548,244.708 293.548,221.939 316.775,221.939 316.775,203.801 293.548,203.801 " /> <path d="M69.539,299.125c19.694,0,35.656,15.962,35.656,35.654c0,19.696-15.961,35.658-35.656,35.658 c-19.69,0-35.656-15.962-35.656-35.658C33.883,315.087,49.849,299.125,69.539,299.125z" /> <path d="M320.594,299.125c19.693,0,35.654,15.962,35.654,35.654c0,19.696-15.961,35.658-35.654,35.658 c-19.688,0-35.658-15.962-35.658-35.658C284.936,315.087,300.905,299.125,320.594,299.125z" /> <path d="M106.82,61.615c-1.978-0.892-4.3-0.014-5.194,1.956c-0.898,1.97-0.018,4.304,1.956,5.19l33.029,14.981 c0.529,0.233,1.078,0.353,1.619,0.353c1.495,0,2.919-0.856,3.581-2.309c0.896-1.97,0.022-4.302-1.956-5.189L106.82,61.615z" /> <path d="M161.099,70.708c0.95,0,1.901-0.337,2.653-1.034c1.601-1.469,1.705-3.941,0.245-5.544l-24.51-26.739 c-1.46-1.591-3.947-1.717-5.55-0.235c-1.604,1.469-1.701,3.941-0.241,5.542l24.505,26.738 C158.979,70.279,160.041,70.708,161.099,70.708z" /> <path d="M206.535,37.148c-1.611-1.475-4.08-1.356-5.549,0.234l-24.501,26.742c-1.461,1.601-1.357,4.082,0.244,5.542 c0.751,0.697,1.703,1.034,2.653,1.034c1.058,0,2.12-0.429,2.897-1.272l24.5-26.735C208.25,41.089,208.142,38.617,206.535,37.148z" /> <path d="M195.067,84.095c0.541,0,1.094-0.12,1.619-0.353l33.031-14.981c1.976-0.886,2.85-3.22,1.96-5.19 c-0.902-1.97-3.219-2.847-5.198-1.956l-33.037,14.982c-1.978,0.888-2.847,3.22-1.954,5.189 C192.154,83.239,193.577,84.095,195.067,84.095z" /> <path d="M375.14,102.627H190.932c-3.594-10.744-13.631-18.541-25.593-18.541c-11.956,0-21.995,7.796-25.591,18.541 c0,0-5.895,0-13.174,0c-7.276,0-13.17,10.223-13.17,22.822v22.828c0,0-6.869,0-15.341,0s-24.533,10.628-35.886,23.742 l-41.621,48.087C9.201,233.223,0,257.901,0,275.246v14.21c0,17.344,6.51,31.402,14.541,31.402H29.08 c5.446-17.349,21.664-29.943,40.823-29.943c19.154,0,35.364,12.595,40.82,29.943h2.687h21.396h145.325 c5.459-17.349,21.673-29.943,40.832-29.943c19.155,0,35.369,12.595,40.823,29.943c0,0,10.019,0,22.378,0 c12.371,0,22.386-14.059,22.386-31.402V134.014C406.541,116.688,392.479,102.627,375.14,102.627z M114.616,213.959 c0,8.66-7.033,15.701-15.701,15.701H63.59c-8.668,0-10.864-5.102-4.891-11.393l24.509-25.848 c5.965-6.294,15.417-11.389,21.109-11.389s10.299,7.035,10.299,15.701V213.959z M340.267,221.029h0.017l-54.51,53.479 l-56.172-53.479h0.016c-8.548-7.27-14.006-18.086-14.006-30.192c0-21.88,17.737-39.616,39.617-39.616 c11.839,0,22.442,5.228,29.699,13.473c7.27-8.245,17.865-13.473,29.707-13.473c21.889,0,39.613,17.735,39.613,39.616 C354.257,202.952,348.807,213.767,340.267,221.029z" /> </g> </g> </g>

                        </svg>
                        <p className="font-poppins font-semibold text-3xl">ResQRide</p>
                    </div>
                    <p className="text-3xl font-poppins font-bold text-center mb-4">
                        Welcome to ResQRide
                    </p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                        <p className="text-xl font-poppins font-bold">Your details :</p>
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="fullName" className="sr-only">
                                    Full Name
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                    placeholder="Enter Your Full Name"
                                    required
                                    autoComplete='name'
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                    placeholder="Enter Your Email Id"
                                    required
                                    autoComplete='email'
                                />
                            </div>
                            <div>
                                <label htmlFor="number" className="sr-only">
                                    Phone Number
                                </label>
                                <input
                                    id="number"
                                    type="tel"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    className="px-4 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                    placeholder="Enter Your Phone Number"
                                    required
                                    autoComplete='tel'
                                />
                            </div>
                            <div>
                                <label htmlFor="dob" className="sr-only">
                                    Date of Birth
                                </label>
                                <input
                                    id="dob"
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                    required
                                />
                            </div>
                            <div className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none">
                                <label htmlFor="gender" className="sr-only">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="outline-none font-poppins w-full"
                                    required
                                >
                                    <option value="" disabled>
                                        Select your gender
                                    </option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <p className="text-xl font-poppins font-bold">Your Credentials :</p>
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="userName" className="sr-only">
                                    User Name
                                </label>
                                <input
                                    id="userName"
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                    placeholder="Enter Your Username"
                                    autoComplete='username'
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <div className="relative w-full">
                                    <input
                                        id="pass"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                        placeholder="Enter Your Password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 cursor-pointer mt-2 right-4 flex items-center text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirm password" className="sr-only">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmpass"
                                    type="text"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                    placeholder="Confirm Password"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="otp" className="sr-only">
                                    OTP verification
                                </label>
                                <input
                                    id="otp"
                                    type="number"
                                    value={otp}
                                    placeholder="Enter the OTP"
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="px-4 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <sp className="text-xl font-poppins font-bold">Your Health-Care details :</sp>
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                            <div className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none">
                                <label htmlFor="bgroup" className="sr-only">
                                    Gender
                                </label>
                                <select
                                    id="bgroup"
                                    value={bloodGroup}
                                    onChange={(e) => setBloodGroup(e.target.value)}
                                    className="outline-none font-poppins w-full"
                                    required
                                >
                                    <option value="" disabled>Select Blood Group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="previous" className="sr-only">
                                    prev medic
                                </label>
                                <input
                                    id="prevmedic"
                                    type="text"
                                    value={prevMedic}
                                    onChange={(e) => setPrevMedic(e.target.value)}
                                    className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                    placeholder="Enter Your Previoud Medical Details"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="alergies" className="sr-only">
                                    Alergies
                                </label>
                                <input
                                    id="alergies"
                                    type="text"
                                    value={alergies}
                                    onChange={(e) => setAlergies(e.target.value)}
                                    className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                    placeholder='Enter Your Alergies'
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="emergencyname" className="sr-only">
                                    Emergency Name
                                </label>
                                <input
                                    id="emergency_name"
                                    type="text"
                                    value={emergencyName}
                                    onChange={(e) => setEmergencyName(e.target.value)}
                                    className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                    placeholder='Enter Your Emergency Contact'
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="emergencynumber" className="sr-only">
                                    Emergency Phone Number
                                </label>
                                <input
                                    id="emergency_num"
                                    type="number"
                                    value={emergencyNum}
                                    onChange={(e) => setEmergencyNum(e.target.value)}
                                    className="px-4 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                    placeholder="Enter Your Emergency Number"
                                    required
                                />
                            </div>
                        </div>
                        <p className="text-xl font-poppins font-bold">Your Location details :</p>
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-gray-700 font-medium">Use GPS Location:</label>
                                <input
                                    type="checkbox"
                                    checked={useAutoLocation}
                                    onChange={() => setUseAutoLocation(!useAutoLocation)}
                                    className="w-5 h-5"
                                />
                            </div>
                            {useAutoLocation && (
                                <>
                                    <input type="hidden" value={location.latitude} readOnly />
                                    <input type="hidden" value={location.longitude} readOnly />
                                </>
                            )}
                            <div>
                                <label htmlFor="address" className="sr-only">Address</label>
                                <input
                                    id="address"
                                    type="text"
                                    value={location.address}
                                    onChange={(e) => setLocation({ ...location, address: e.target.value })}
                                    className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                    placeholder="Enter Your Address"
                                    readOnly={useAutoLocation}
                                />
                            </div>
                            <div>
                                <label htmlFor="city" className="sr-only">City</label>
                                <input
                                    id="city"
                                    type="text"
                                    value={location.city}
                                    onChange={(e) => setLocation({ ...location, city: e.target.value })}
                                    className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                    placeholder="City"
                                    readOnly={useAutoLocation}
                                />
                            </div>
                            <div>
                                <label htmlFor="state" className="sr-only">State</label>
                                <input
                                    id="state"
                                    type="text"
                                    value={location.state}
                                    onChange={(e) => setLocation({ ...location, state: e.target.value })}
                                    className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                    placeholder="State"
                                    readOnly={useAutoLocation}
                                />
                            </div>
                            <div>
                                <label htmlFor="country" className="sr-only">Country</label>
                                <input
                                    id="country"
                                    type="text"
                                    value={location.country}
                                    onChange={(e) => setLocation({ ...location, country: e.target.value })}
                                    className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                                    placeholder="Country"
                                    readOnly={useAutoLocation}
                                />
                            </div>
                            {useAutoLocation && (
                                <button
                                    type="button"
                                    onClick={getUserLocation}
                                    className="px-4 py-2 bg-gradient-to-br from-sky-300 via-sky-500 to-sky-700 cursor-pointer text-white rounded-lg mt-2"
                                >
                                    Refresh Location
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#00dfd0] mt-4 text-white font-bold text-lg py-3 rounded-lg transition duration-300 cursor-pointer hover:bg-[#7bdfd8]"
                        >
                            Sign Up
                        </button>
                    </form>
                    <p className="text-center mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#00e0d1]">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserSignup;