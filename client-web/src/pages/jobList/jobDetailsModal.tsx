import React, { useState } from 'react';
import { Job } from '@/domain/job';

interface JobDetailsModalProps {
    job: Job;
    onClose: () => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose }) => {
    return (
        <div className="modal-overlay w-full">
            <div className="modal">
                <div>
                    <p><strong>Descrição da vaga:</strong> {job.description}</p>
                    <p><strong>Horas por semana:</strong> {job.weekly_hours}</p>
                </div>
                <button
                    className='bg-red-500 text-white w-full text-sm rounded'
                    onClick={onClose}>
                        Fechar Detalhes
                </button>
            </div>
        </div>
    );
};

export default JobDetailsModal;