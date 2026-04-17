type CustomResponseType<dataType> = {
    message: string;
    payload: dataType;
    status: number;
    extra?: any;
};

export default CustomResponseType;
