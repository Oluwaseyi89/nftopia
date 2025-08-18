// // create-collection.dto.ts
// import { IsString, IsUrl, IsNotEmpty, IsOptional } from 'class-validator';
// import { UserResponseDto } from '../../users/dto/create-user.dto';


// export class CreateCollectionDto {
//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsString()
//   @IsNotEmpty()
//   description: string;

//   @IsUrl()
//   @IsNotEmpty()
//   bannerImage: string;
// }

// // update-collection.dto.ts
// // import { IsOptional, IsString, IsUrl } from 'class-validator';

// export class UpdateCollectionDto {
//   @IsOptional()
//   @IsString()
//   name?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   @IsOptional()
//   @IsUrl()
//   bannerImage?: string;
// }

// // collection-response.dto.ts

// export class CollectionResponseDto {
//   id: string;
//   name: string;
//   description: string;
//   bannerImage: string;
//   creator: UserResponseDto;
//   createdAt: Date;
// }

import { IsString, IsUrl, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { UserResponseDto } from '../../users/dto/create-user.dto';


export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  bannerImage: string;

  // Blockchain linkage (optional on creation, since contract may be deployed async)
  @IsOptional()
  @IsString()
  @Length(66, 66) // 0x + 64 hex chars
  txHash?: string;

  @IsOptional()
  @IsString()
  @Length(66, 66)
  collectionAddress?: string;
}


export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  bannerImage?: string;

  @IsOptional()
  @IsString()
  @Length(66, 66)
  txHash?: string;

  @IsOptional()
  @IsString()
  @Length(66, 66)
  collectionAddress?: string;
}



export class CollectionResponseDto {
  id: string;
  name: string;
  description: string;
  bannerImage: string;
  txHash?: string;
  collectionAddress?: string;
  creator: UserResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
