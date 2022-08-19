import { UserRole } from './../users/entities/user.entity';
import { SetMetadata } from '@nestjs/common';

export type AllowedRoles = keyof typeof UserRole | 'Any';
export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
