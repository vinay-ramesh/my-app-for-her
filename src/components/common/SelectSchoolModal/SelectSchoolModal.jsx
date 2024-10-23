import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageAssets from '../../../assets/imageAsset';
import { useDebounce } from '../../../utils/customHooks/useDebounce';
import { fetchInstitutionList, loginToInstitution } from '../../../api/login';
import secureLocalStorage from 'react-secure-storage';
import { toast, Toaster } from 'react-hot-toast';
import SchoolTable from '../SchoolTable/SchoolTable';
import Drawer from '../Drawer/Drawer';
import ProgressLoader from '../ProgressLoader/ProgressLoader';

const SelectSchoolModal = (props) => {
  const { toggleModalOpenClose, openModal } = props;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [institutionList, setInstitutionList] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState({ institution_id: '', place: '', institution_name: '' });
  const [searchText, setSearchText] = useState('');
  const debounceValue = useDebounce(searchText);
  const [isSearchLoader, setIsSearchLoader] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const navigate = useNavigate();
  const userId = secureLocalStorage.getItem('cmn_user_id');

  useEffect(() => {
    const getInstitutions = async () => {
      try {
        setIsSearchLoader(true);
        const listOfInstitutions = await fetchInstitutionList(userId, debounceValue);
        // console.log('listOfInstitutions', listOfInstitutions);
        if (listOfInstitutions?.length) {
          setNoDataFound(false);
          setInstitutionList(listOfInstitutions);
          setIsSearchLoader(false);
        } else {
          setNoDataFound(true);
          setInstitutionList([]);
          toast('No institutions found');
          setIsSearchLoader(false);
        }
      } catch (err) {
        console.log('err in fetching institution list', err);
        setIsSearchLoader(false);
      }
    };
    getInstitutions();
  }, [debounceValue]);

  const modalOpenClose = () => {
    setModalIsOpen(!modalIsOpen);
    toggleModalOpenClose();
  };

  const handleSelectedSchool = (school) => {
    setSelectedSchool((prevState) => {
      return {
        ...prevState,
        place: school.place,
        institution_id: school.institution_id,
        institution_name: school.institution_name,
      };
    });
  };

  const handleModalSubmit = async () => {
    if (selectedSchool.institution_id) {
      try {
        const response = await loginToInstitution(userId, selectedSchool.institution_id);
        // console.log('response from loginToInstitution', response);
        const result = response?.user;
        secureLocalStorage.setItem('sessionExp', response?.expiry);
        secureLocalStorage.setItem('token', response?.token);
        result.emblem_file_path ? secureLocalStorage.setItem('schoolEmblem', result.emblem_file_path) : null;
        secureLocalStorage.setItem('board_details', result.board_details);
        secureLocalStorage.setItem('cmn_user_email', result.email);
        secureLocalStorage.setItem('cmn_user_full_name', result.full_name);
        secureLocalStorage.setItem('cmn_school_id', result.institution_id);
        secureLocalStorage.setItem('schoolName', result.institution_name);
        secureLocalStorage.setItem('schoolLocation', result.place);
        secureLocalStorage.setItem('role', result.role_name);
        secureLocalStorage.setItem('cmn_user_id', result.user_id);
        secureLocalStorage.setItem('role_id', result.role_id);

        toast.success(`Login Successful`, { duration: 2000 });
        toast.success(`Selected School is ${selectedSchool.institution_name}`, { duration: 2000 });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
        toggleModalOpenClose();
      } catch (err) {}
    } else {
      toast.error('Please select the school and then click OK!', { duration: 3000 });
    }
  };

  return (
    <>
      <Drawer>
        <div className="flex flex-col w-full h-auto gap-y-5 text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl">
          <div className="flex items-center justify-between w-full h-6 ">
            <div className="text-gray-500 tracking-wider font-semibold">Select School</div>
            <img src={ImageAssets.close_btn} alt="close-modal" className="cursor-pointer" onClick={modalOpenClose} />
          </div>
          <div className="flex relative">
            <input
              className="border border-gray-300 w-full h-11 rounded-lg px-10 text-md focus:outline-none text-gray-900 placeholder:text-md"
              placeholder="Search school name"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="h-11 flex justify-around items-center absolute left-4">
              <img src={ImageAssets.search} alt="search-icon" />
            </div>
            {isSearchLoader ? (
              <div className="h-11 flex justify-around items-center absolute right-0">
                <ProgressLoader />
              </div>
            ) : null}
          </div>
          <SchoolTable
            institutionList={institutionList}
            handleSelectedSchool={handleSelectedSchool}
            selectedSchool={selectedSchool}
            noDataFound={noDataFound}
          />
          <div className="flex items-center justify-end w-full h-6 xs:gap-x-4 sm:gap-x-4 gap-x-12">
            <button
              className="border border-gray-200 rounded-lg min-w-fit px-4 py-2 font-medium text-gray-900 text-md"
              onClick={modalOpenClose}
            >
              Cancel
            </button>
            <button
              className="border border-gray-200 rounded-lg min-w-fit px-6 py-2 font-medium bg-[#1A56DB] text-white text-md"
              onClick={handleModalSubmit}
            >
              OK
            </button>
          </div>
        </div>
      </Drawer>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default SelectSchoolModal;
