const STORAGE_KEY = 'boletasapp:company:v1';

const EMPTY_COMPANY = {
  companyName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  logo: '',
};

export function loadCompany() {
  if (typeof localStorage === 'undefined') return { ...EMPTY_COMPANY };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored
      ? { ...EMPTY_COMPANY, ...JSON.parse(stored) }
      : { ...EMPTY_COMPANY };
  } catch {
    return { ...EMPTY_COMPANY };
  }
}

export function saveCompany(company) {
  if (typeof localStorage === 'undefined') return false;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(company));
    return true;
  } catch {
    return false;
  }
}
