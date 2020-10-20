export class DistributionList {
    id: number;
    createdDate: Date;
    distributionList: string;
    senderId: number;
    userSize: number;
    distributionListUsers: DistributionListUser[];
}

export class DistributionListUser {
    id: number;
    createdDate: Date;
    lastModifiedDate: Date;
    listId: number;
    userId: number;
}