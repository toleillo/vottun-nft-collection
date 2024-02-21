import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  async getNFTs() {
    const vottunKey = this.configService.get<string>('VOTTUN_KEY');
    const vottunApp = this.configService.get<string>('VOTTUN_APPID');

    const apiUrl = 'https://api.vottun.tech/erc/v1/erc721/tokenUri';
    const headersRequest = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${vottunKey}`,
      'x-application-vkn': `${vottunApp}`,
    };

    const nfts = [];
    const ids = [11, 12, 13, 14];

    for (const el of ids) {
      const params = {
        contractAddress: '0x1008617afC0057d71ADcd0a9AB65F41a88F31D20',
        network: 80001,
        id: el,
      };

      const { data } = await firstValueFrom(
        this.httpService.post(apiUrl, params, { headers: headersRequest }),
      );

      const metadataUrl = this.clone(data.uri);
      const resp = await firstValueFrom(this.httpService.get(metadataUrl));
      const metadata = resp.data;

      nfts.push(metadata);
    }

    return nfts;
  }

  clone(a) {
    return JSON.parse(JSON.stringify(a));
  }
}
