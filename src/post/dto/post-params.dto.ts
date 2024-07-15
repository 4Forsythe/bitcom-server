export enum PostSortEnum {
	VIEWS = 'views',
	COMMENTS = 'commented',
	CREATED_AT = 'createdAt'
}

export class PostParamsDto {
	sortBy?: PostSortEnum
	orderBy?: 'desc' | 'asc'
	skip?: number
	take?: number
}
