export class UpdateUserDto {
  name?: any;
  email?: any;
  age?: any;
  // Confusing flag that should not exist here
  shouldExist?: boolean;
}
