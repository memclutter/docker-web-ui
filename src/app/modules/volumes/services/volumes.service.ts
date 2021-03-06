import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { DockerService } from '../../../services/docker.service';

import { VolumeModel } from '../models/volume.model';
import { VolumesListParamsModel } from '../models/volumes-list-params.model';
import { VolumesListResponseModel } from '../models/volumes-list-response.model';
import { VolumesPruneParamsModel } from '../models/volumes-prune-params.model';
import { VolumesPruneResponseModel } from '../models/volumes-prune-response.model';

@Injectable()
export class VolumesService extends DockerService {

  /**
   * List volumes
   *
   * @param params
   */
  public getVolumes(params?: VolumesListParamsModel): Observable<Array<VolumeModel>> {
    const url = `${VolumesService.API_END_POINT}volumes`;
    const search = params || {};

    return this.http.get(url, {search})
      .map((response: Response) => response.json() as VolumesListResponseModel)
      .map((response: VolumesListResponseModel) => {
        if (response.Warnings && response.Warnings.length !== 0) {
          for (let i = 0; i < response.Warnings.length; i++) {
            this.notifyService.warning(response.Warnings[i]);
          }
        }

        return response.Volumes;
      }).catch(this.handleError.bind(this));
  }

  /**
   * Remove a volume
   *
   * @param name
   */
  public removeVolume(name: string): Observable<any> {
    const url = `${VolumesService.API_END_POINT}volumes/${name}`;

    return this.http.delete(url)
      .map((response: Response) => response.json())
      .catch(this.handleError.bind(this));
  }

  /**
   * Delete unused volumes
   *
   * @param params
   */
  public pruneVolumes(params?: VolumesPruneParamsModel): Observable<VolumesPruneResponseModel> {
    const url = `${VolumesService.API_END_POINT}volumes/prune`;
    const body = params || {};

    return this.http.post(url, body)
      .map((response: Response) => response.json() as VolumesPruneResponseModel)
      .catch(this.handleError.bind(this));
  }
}
