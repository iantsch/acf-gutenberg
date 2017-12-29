import AcfGroupService from './AcfGroupService';

const Services = (store) => {
    const acfGroupService = new AcfGroupService(store);
    return {
        acfGroupService
    }
};

export default Services;
