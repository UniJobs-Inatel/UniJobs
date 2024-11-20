
export enum JobStatus {
    pending='pending',
    approved='approved',
    reproved='reproved',
    removed='removed',
}

type statusBadgeVariants = 'pending' | 'approved' | 'removed' ;

export const jobStatusMapper:Record<JobStatus, {label:string, variant:statusBadgeVariants}> = {

    pending:{
        label:'Pendente',
        variant:"pending"
    },
    approved:{
        label:'Aprovado',
        variant:"approved"
    },
    removed:{
        label:'Removido',
        variant:"removed"
    },
    reproved:{
        label:'Reprovado',
        variant:"removed"
    }

}
