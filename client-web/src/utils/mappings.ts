export const jobTypeMapping: Record<string, string> = {
    "Estágio": "internship",
    "Freelancer": "freelance",
    "Trainee": "trainee",
    "CLT": "clt",
    "PJ": "pj",
};

export const modalityMapping: Record<string, string> = {
    "Presencial": "on_site",
    "Híbrido": "hybrid",
    "Remoto": "remote"
};

export const fieldMaping: Record<string, string> = {
    "TI": "1",
    "Engenharia": "2",
    "Ciências Exatas": "3",
    "Ciências Humanas": "4",
    "Negócios": "5",
    "Saúde": "6",
    "Artes": "7",
    "Agricultura": "8",
    "Direito": "9",
    "Educação": "10",
};

export const jobTypes = Object.keys(jobTypeMapping) as Array<keyof typeof jobTypeMapping>;
export const modalities = Object.keys(modalityMapping) as Array<keyof typeof modalityMapping>;
export const fields = Object.keys(fieldMaping) as Array<keyof typeof fieldMaping>;