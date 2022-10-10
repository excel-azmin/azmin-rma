import { MipPropertyType, PropertyCmsCreateRequest, PropertyOneOfDto, PropertyPoolDto, PropertySingleFamilyHomeDto } from '@baza/mip/mip-property/shared';
import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { from, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
  
  
@Injectable()
export class CreateMipPropertyDTOGuard implements CanActivate {
    
    constructor() {}

    canActivate(context: ExecutionContext) {
        const httpContext = context.switchToHttp();
        const body: PropertyCmsCreateRequest = httpContext.getRequest().body;

        return of({}).pipe(
            switchMap(obj => from(this.validatePropertyDto(body))),
            switchMap(success => of(true)),
            catchError(error => throwError(new BadRequestException({error : error.map(e => e.constraints)})))
        )
    }

    async validatePropertyDto(body: PropertyCmsCreateRequest){
        switch (body.entityBody.type) {
            case MipPropertyType.PropertyPool:
                const propertyPool = new PropertyPoolDto()
                Object.assign(propertyPool,body.entityBody);
                await this.validateOrRejectExample(propertyPool)
                return true;

            case MipPropertyType.SingleFamilyHome:
                const propertySingleFamily = new PropertySingleFamilyHomeDto()
                Object.assign(propertySingleFamily,body.entityBody);
                await this.validateOrRejectExample(propertySingleFamily)
                return true;
        
            default:
                throw new BadRequestException("Invalid property type.");
        }
    }

    async validateOrRejectExample(input) {
        try {
          await validateOrReject(input);
          return true;
        } catch (errors) {
          throw errors;
        }
      }
}