import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig: CorsOptions = {
	origin: ['http://localhost:3000', 'https://courses.ntduyfit.games']
};
