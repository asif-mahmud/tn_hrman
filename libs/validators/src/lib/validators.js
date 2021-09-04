import * as Yup from 'yup';

const employee = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email address is required'),
});

const email = Yup.object().shape({
  subject: Yup.string().required('Email subject is required'),
  body: Yup.string().required('Email body is required'),
});

export default {
  Employee: employee,
  Email: email,
};
