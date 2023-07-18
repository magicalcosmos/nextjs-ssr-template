import { useState, useEffect, type ChangeEvent, type ChangeEventHandler } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BaseDialog from '~/layouts/components/BaseDialog';
import DatePickerBox from '~/layouts/components/DatePickerBox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import dayjs, { Dayjs } from 'dayjs';

import { $api } from '~/api';

import * as TypeLicense from '~/types/licenses';
import * as Dict from '~/utils/dict';
import message from '~/utils/message';
import { useAppDispatch } from '~/store';
import { showLoading, hideLoading } from '~/store/module/globalLoading/reducer';

type TUpdateLicenseProps = { 
  t: Function;
  title: string; 
  open: boolean;
  userId: number;
  licenseId: number;
  onClose: Function;
  onConfirm: Function;
};

export default function UpdateLicense(props: TUpdateLicenseProps) {
  const { t, title, open, userId, licenseId, onClose, onConfirm } = props;
  const dispatch = useAppDispatch();
  /** 内核-规则集源数据 */
  const coreRulesData = {
    wukong: {
      specs: [{
        name: 'GJB8114-2013',
      }],
      needLicense: true,
    },
    hcscli: {
      specs: [{
        name: 'MISRAC-2012',
      }, {
        name: 'GJB5369-2005',
      }, {
        name: 'MISRAC++2008',
      }, {
        name: 'MISRAC-2004',
      }, {
        name: 'TJ_DW230-2020-C',
      }, {
        name: 'GJB8114-2013',
      }],
      needLicense: true,
    },
    certify: {
      specs: [{
        name: 'GJB8114-2013',
      }, {
        name: 'GJB5369-2005',
      }, {
        name: 'MISRAC-2012',
      }, {
        name: 'MISRAC-2004',
      }],
      needLicense: false,
    },
    cppcheck:  {
      specs: [{
        name: 'MISRAC-2012',
      }, {
        name: 'MISRAC-2004',
      }, {
        name: 'TJ_DW230-2020-C',
      }],
      needLicense: false,
    }
  };
  /** 单元导出用例格式 */
  const unitCaseExportFormatList = [{ label: 'srt', value: 'srt' }, { label: 'yml', value: 'yml' }, { label: 'tcf', value: 'tcf' }, { label: t('huicheng-extension'), value: 'xlsx-huicheng' }, { label: 'xlsx-614', value: 'xlsx-614' }];
  /** 单元导入用例格式 */
  const unitCaseImportFormatList = [{ label: 'srt', value: 'srt' }, { label: t('huicheng-extension'), value: 'xlsx-huicheng' }, { label: 'xlsx/xlsm-614', value: 'xlsx/xlsm-614' }];
  /** 单元测试语言列表 */
  const unitTestLanguageList = [{ value: 'c', label: t('C') }, { value: 'c/c++', label: t('C++') }];
  /** 集成测试用例导出格式数据 */
  const integrationCaseExportFormatList = [{ label: 'srt', value: 'srt' }, { label: 'xlsx-614', value: 'xlsx-614' }];
  /** 集成测试用例导入格式数据 */
  const integrationCaseImportFormatList = [{ label: 'srt', value: 'srt' }, { label: 'xlsx/xlsm-614', value: 'xlsx/xlsm-614' }];
  /** 有效期 */
  const customType = 'custom';

  /**
   * 日期格式
   */
  const dateFormat = (date: Dayjs | string) => {
    return dayjs(date).format('YYYY-MM-DD');
  }
  const validDateSource = {
    one: dateFormat(dayjs().add(1, 'month')),
    three: dateFormat(dayjs().add(3, 'month')),
    six: dateFormat(dayjs().add(6, 'month')),
    year: dateFormat(dayjs().add(1, 'year'))
  };
  const validDateList = [{ value: 'one', label: t('a-month') }, { value: 'three', label: t('three-month') }, { value: 'six', label: t('six-month') }, { value: 'year', label: t('a-year') }, { value: customType, label: t('defined') }];

  /** 表单原始数据 */
  const importFormatKey = 'case-import-format';
  const exportFormatKey = 'case-format';
  const originUnit = {
    expired: '',
    startTime: '',
    [exportFormatKey]: [],
    [importFormatKey]: []
  };
  const originStatic = {
    expired: '',
    startTime: '',
    modules: {}
  };
  const originIntegrate = {
    expired: '',
    startTime: '',
    [exportFormatKey]: [],
    [importFormatKey]: []
  };
  const originForm = {
    "licenseName": "",
    "cpuLimit": null,
    "userLimit": null,
    "versionType": Dict.VERSION_TYPE.OFFICIAL,
    "dataCollection": 0,
    "language": [],
    "modules": {
      "static-check": originStatic,
      "unit-test": originUnit,
      "integration-test": originIntegrate
    },
    "comment": ''
  };

  /** 表单数据 */
  const [formParam, useFormParam] = useState<TypeLicense.TLicenseDetail>(originForm as any);
  const originModules = {
    [Dict.MODULES.UNIT]: true,
    [Dict.MODULES.STATIC]: true,
    [Dict.MODULES.INTEGRATE]: true
  };
  /** 勾选的功能模块 */
  const [currentModules, useCurrentModules] = useState<{
    [Dict.MODULES.UNIT]: boolean;
    [Dict.MODULES.STATIC]: boolean;
    [Dict.MODULES.INTEGRATE]: boolean;
  }>(originModules);
  /** 勾选的规则集 */
  const [specCoreMap, useSpecCoreMap] = useState<{
    [key: string]: string;
  }>({});
  /** 输入许可证 */
  const [licenseCodeMap, useLicenseMap] = useState<{
    [key: string]: string;
  }>({});
  const originExpiredRadio = {
    [Dict.MODULES.UNIT]: '',
    [Dict.MODULES.STATIC]: '',
    [Dict.MODULES.INTEGRATE]: ''
  };
  /** 勾选的有效期 */
  const [expiredRadioMap, useExpiredRadioMap] = useState<{
    [key: string]: string;
  }>(originExpiredRadio);


  useEffect(() => {
    resetForm();
    if (licenseId) {
      fetchDetail();
    } else {
      useFormParam(originForm as any);
    }
  }, [licenseId]);


  /**
   * reset form
   */
  const resetForm = () => {
    useCurrentModules(originModules);
    useSpecCoreMap({});
    useLicenseMap({});
    useExpiredRadioMap(originExpiredRadio);
  }

  /**
   * handle valid
   */
  const handleValidForm = () => {
    let msg = '';
    const param = JSON.parse(JSON.stringify(formParam));
    for (let module in currentModules) {
      if ((currentModules as any)[module]) {
        if (!param.modules[module].expired) {
          msg = 'sys-licenses:pls-ipt-date';
        } else {
          param.modules[module].expired = param.modules[module].expired;
        }
        if (!param.modules[module].startTime) {
          param.modules[module].startTime = dayjs().format('YYYY-MM-DD');
        }
        if (module === Dict.MODULES.STATIC) {
          // 处理规则集
          // 规则集必选
          if (!Object.keys(specCoreMap).length) {
            msg = 'sys-licenses:pls-slt-specs';
          } else {
            // 拼接规则集数据
            const modules: any = {};
            // 规则集许可证
            const cores = Object.entries(specCoreMap);
            for (let i = 0; i < cores.length; i++) {
              const [spec, core] = cores[i];
              const needLicense = (coreRulesData as any)[core]?.needLicense;
              if (needLicense && !licenseCodeMap[core]) {
                msg = 'sys-licenses:pls-ipt-license-code';
                break;
              }
              if (modules[core]) {
                modules[core].specs.push(spec);
              } else {
                modules[core] = {
                  specs: [spec]
                };
              }
              if (needLicense) {
                modules[core].license = licenseCodeMap[core];
              }
            }
            if (msg) {
              break;
            }
            param.modules[Dict.MODULES.STATIC].modules = modules;
          }

        }
      } else {
        delete param.modules[module];
      }
    }

    if (!Object.keys(param.modules).length) {
      msg = 'sys-licenses:pls-slt-modules';
    }
    if (!param.language.length) {
      msg = 'sys-licenses:pls-slt-lang';
    }

    if (!param.cpuLimit) {
      msg = 'sys-licenses:pls-ipt-cpu-count-label';
    } else {
      param.cpuLimit = Number(param.cpuLimit);
    }
    if (!param.userLimit) {
      msg = 'sys-licenses:pls-ipt-user-count-label';
    } else {
      param.userLimit = Number(param.userLimit);
    }
    if (param.versionType) {
      param.versionType = Number(param.versionType);
    }
    if (param.dataCollection) {
      param.dataCollection = Number(param.dataCollection);
    }
    if (!param.licenseName) {
      msg = 'sys-licenses:pls-ipt-license-name-label';
    }
    return new Promise((resolve, reject) => {
      if (msg) {
        message.error({
          content: t(msg)
        });
        reject();
      } else {
        resolve(param);
      }
    });
  }

  /**
   * handle confirm
   */
  const handleConfirm = () => {
    handleValidForm().then(license => {
      dispatch(showLoading());
      const api: any = licenseId ? $api.sysLicense.update : $api.sysLicense.create;
      api({
        userId: Number(userId),
        licenses: [license as TypeLicense.TLicenseDetail]
      }).then(() => {
        onConfirm();
      }).catch(() => {}).finally(() => {
        dispatch(hideLoading());
      })
    });
  };

  /**
   * close dialog
   */
  const handleCloseDialog = () => {
    onClose();
  }

  /**
   * handle module change
   */
  const handleModuleChange = (event: ChangeEvent<HTMLInputElement>) => {
    useCurrentModules({
      ...currentModules,
      [event.target.name]: event.target.checked,
    });
  }

  /**
   * 选择语言
   */
  const handleLangChange = (event: ChangeEvent<HTMLInputElement>) => {
    const lang = event.target.value;
    const param = JSON.parse(JSON.stringify(formParam));
    const idx = param.language.indexOf(lang);
    if (idx === -1) {
      param.language.push(lang);
    } else {
      param.language.splice(idx, 1);
    }
    useFormParam(param);
  }

  /**
   * 选择规则集
   * @param event
   * @param core
   * @param spec
   */
  const handleSpecChange = (event: ChangeEvent<HTMLInputElement>, core: string, spec: string) => {
    const data = JSON.parse(JSON.stringify(specCoreMap));
    if (event.target.checked) {
      data[spec] = core;
    } else {
      delete data[spec];
    }
    useSpecCoreMap(data);
  }

  /**
   * 显示需要许可证的规则集的输入框
   * @param module
   */
  const showLicenseInput = (coreKey: string, core: {
    needLicense: boolean;
  }) => {
    return Object.values(specCoreMap).includes(coreKey) && core.needLicense;
  }

  /**
   * 输入许可证
   * @param event
   */
  const handleLicenseCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    useLicenseMap({
      ...licenseCodeMap,
      [event.target.name]: event.target.value
    });
  }

  /**
   * 勾选有效期单选框
   * @param expiredRadioValue
   * @param moduleName
   */
  const handleExpiredRadioChange = (expiredRadioValue: string, moduleName: string) => {
    useExpiredRadioMap({
      ...expiredRadioMap,
      [moduleName]: expiredRadioValue
    });
    if (expiredRadioValue !== customType) {
      handleExpiredChange((validDateSource as any)[expiredRadioValue], moduleName);
    }
  }

  /**
   * 勾选日期选择期
   * @param expired
   * @param moduleName
   */
  const handleDatePickerChange = (expired: Dayjs, moduleName: string) => {
    handleExpiredChange(dateFormat(expired), moduleName);
  }

  /**
   * 修改表单日期值
   * @param expired
   * @param moduleName
   */
  const handleExpiredChange = (expired: Dayjs | string | null, moduleName: string) => {
    const data = JSON.parse(JSON.stringify(formParam));
    data.modules[moduleName].expired = expired;
    useFormParam(data);
  }

  /**
   * 选择用例格式
   * @param event
   * @param moduleName
   * @param caseFormatKey
   */
  const handleCaseFormatChange = (event: ChangeEvent<HTMLInputElement>, moduleName: string, caseFormatKey: string) => {
    const param = JSON.parse(JSON.stringify(formParam));
    const idx = param.modules[moduleName][caseFormatKey].indexOf(event.target.value);
    if (idx === -1) {
      param.modules[moduleName][caseFormatKey].push(event.target.value);
    } else {
      param.modules[moduleName][caseFormatKey].splice(idx, 1);
    }
    useFormParam(param);
  }

  /**
   * 修改表单数据
   * @param event
   */
  const handleFormDataChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    useFormParam({
      ...formParam,
      [event.target.name]: event.target.value
    });
  }


  const fetchDetail = () => {
    dispatch(showLoading());
    $api.sysLicense.detail({
      licenseIds: [licenseId]
    }).then((res) => {
      init(res.data[0]);
    }).catch(() => {
      dispatch(hideLoading());
    })
  }

  const init = (detail: TypeLicense.TLicenseDetail) => {
    delete detail.autoRecycle;
    const currentModulesCopy = {...currentModules};
    // 初始化功能模块
    for (let key in currentModules) {
      if (!(detail.modules as any)[key]) {
        switch (key) {
          case Dict.MODULES.UNIT:
            detail.modules[key] = originUnit;
            break;
          case Dict.MODULES.STATIC:
            detail.modules[key] = originStatic;
            break;
          case Dict.MODULES.INTEGRATE:
            detail.modules[key] = originIntegrate;
            break;
        }
        (currentModulesCopy as any)[key] = false;
      } else {
        (currentModulesCopy as any)[key] = true;
        if (key === Dict.MODULES.STATIC) {
          const coreSpecMap: any = {};
          const licenseMap: any = {};
          for (let coreKey in (detail.modules as any)[key].modules) {
            const core = (detail.modules[key] as any).modules[coreKey];
            core.specs.forEach((spec: any) => {
              coreSpecMap[spec] = coreKey;
            });
            if (core.license) {
              licenseMap[coreKey] = core.license;
            }
          }
          useLicenseMap(licenseMap);
          useSpecCoreMap(Object.assign(specCoreMap, coreSpecMap));
        }
      }
    }
    useCurrentModules(Object.assign(currentModules, currentModulesCopy));
    useFormParam(detail);
    dispatch(hideLoading());
  }

  return (
    <BaseDialog
      t={t}
      dialogClass="admin-update-license"
      title={title}
      open={!!open}
      onCancel={handleCloseDialog}
      onClose={handleCloseDialog}
      onConfirm={handleConfirm}
      contentBody={
        <form>
          <Box className="form-line">
            <Typography className="form-line-label required" variant="body2">
              {t('license-name-label')}
            </Typography>
            <Box className="form-line-content">
              <input className="form-input" name="licenseName" defaultValue={formParam.licenseName} onChange={handleFormDataChange} placeholder={t('pls-ipt-license-name-label')} />
            </Box>
          </Box>
          <Box className="form-line">
            <Typography className="form-line-label required" variant="body2">
              {t('user-count-label')}
            </Typography>
            <Box className="form-line-content">
              <input className="form-input" name="userLimit" defaultValue={formParam.userLimit || ''} onChange={handleFormDataChange} placeholder={t('pls-ipt-user-count-label')} />
            </Box>
          </Box>
          <Box className="form-line">
            <Typography className="form-line-label required" variant="body2">
              {t('cpu-count-label')}
            </Typography>
            <Box className="form-line-content">
              <input className="form-input" name="cpuLimit" defaultValue={formParam.cpuLimit || ''} onChange={handleFormDataChange} placeholder={t('pls-ipt-cpu-count-label')} />
            </Box>
          </Box>
          <Box className="form-line">
            <Typography className="form-line-label required" variant="body2">
              {t('user-type')}
            </Typography>
            <RadioGroup
              row
              value={formParam.versionType}
              onChange={handleFormDataChange}
              name="versionType"
              className="form-line-content form-radio width-first-type"
            >
              <FormControlLabel value={Dict.VERSION_TYPE.OFFICIAL} control={<Radio size="small" />} label={t('official-version')} />
              <FormControlLabel value={Dict.VERSION_TYPE.TRIAL} control={<Radio size="small" />} label={t('trial-version')} />
            </RadioGroup>
          </Box>
          <Box className="form-line">
            <Typography className="form-line-label" variant="body2">
              {t('data-source')}
            </Typography>
            <RadioGroup
              row
              value={formParam.dataCollection}
              onChange={handleFormDataChange}
              name="dataCollection"
              className="form-line-content form-radio width-first-type"
            >
              <FormControlLabel value={Dict.DATA_COLLECTION.OFFICIAL} control={<Radio size="small" />} label={t('official-server')} />
              <FormControlLabel value={Dict.DATA_COLLECTION.TRIAL} control={<Radio size="small" />} label={t('trial-server')} />
            </RadioGroup>
          </Box>
          <Box className="form-line">
            <Typography className="form-line-label required" variant="body2">
              {t('language')}
            </Typography>
            <FormGroup className="form-line-content form-checkbox width-first-type" row>
              {unitTestLanguageList.map(lang => (
                <FormControlLabel checked={formParam.language.includes(lang.value)} key={`unit-lang-${lang.value}`} control={<Checkbox onChange={handleLangChange} />} value={lang.value} label={lang.label} />
              ))}
            </FormGroup>
          </Box>
          <Box className="form-line">
            <Typography className="form-line-label required" variant="body2">
              {t('module')}
            </Typography>
            <Box className="form-line-content">
              <FormGroup className="form-checkbox width-first-type" row>
                <FormControlLabel checked={currentModules[Dict.MODULES.STATIC]} control={<Checkbox onChange={handleModuleChange} name={Dict.MODULES.STATIC}  />} label={t('static-test')} />
                <FormControlLabel checked={currentModules[Dict.MODULES.UNIT]} control={<Checkbox onChange={handleModuleChange} name={Dict.MODULES.UNIT}  />} label={t('unit-test')} />
                <FormControlLabel checked={currentModules[Dict.MODULES.INTEGRATE]} control={<Checkbox onChange={handleModuleChange} name={Dict.MODULES.INTEGRATE} />} label={t('integrate-test')} />
              </FormGroup>
              <Paper elevation={0} className={`gray-box ${!currentModules[Dict.MODULES.STATIC] && 'hide'}`}>
                <Typography className="gray-box-title" variant="body2">
                  {t('static-test')}
                </Typography>
                <Box className="form-line">
                  <Typography className="gray-box-label" variant="body2">
                    {t('core')}-{t('specs')}
                  </Typography>
                  <Box>
                    {Object.entries(coreRulesData).map(([coreKey, core]) => (
                      <Box className="form-line" key={`static-core-${coreKey}`}>
                        <Typography className="module-label" variant="body2">
                          {t(coreKey)}
                        </Typography>
                        <Box>
                          <FormGroup className="form-checkbox width-spec" row>
                            {core.specs.map(spec => (
                              specCoreMap[spec.name] && specCoreMap[spec.name] !== coreKey ? 
                              <FormControlLabel 
                                disabled
                                checked={false}
                                name={spec.name} 
                                key={`static-spec-${spec.name}`}
                                control={<Checkbox />} 
                                label={spec.name} /> : 
                                <FormControlLabel 
                                  checked={specCoreMap.hasOwnProperty(spec.name) && specCoreMap[spec.name] === coreKey}
                                  key={`static-spec-${spec.name}`}
                                  control={<Checkbox 
                                              onChange={(event) => handleSpecChange(event, coreKey, spec.name)} 
                                              name={spec.name} 
                                            />} 
                                  label={spec.name} />
                            ))}
                          </FormGroup>
                          {showLicenseInput(coreKey, core) ? (
                            <Box className="form-line">
                              <Typography className="form-line-label required" variant="body2">
                                {t('license-code')}
                              </Typography>
                              <Box className="form-line-content">
                                <input className="form-input license-input" name={coreKey} defaultValue={licenseCodeMap[coreKey]} onChange={handleLicenseCodeChange} placeholder={t('pls-ipt-license-code')} />
                              </Box>
                            </Box>
                          ) : ''}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box className="form-line">
                  <Typography className="gray-box-label" variant="body2">
                    {t('valid-date')}
                  </Typography>
                  <Box sx={{ display: 'flex' }}>
                    <RadioGroup
                      row
                      value={expiredRadioMap[Dict.MODULES.STATIC]}
                      onChange={(event) => handleExpiredRadioChange(event.target.value, Dict.MODULES.STATIC)}
                      className="form-radio width-valid-date"
                    >
                      {validDateList.map(valid => (
                        <FormControlLabel key={`static-valid-${valid.value}`} control={<Radio size="small" />} value={valid.value} label={valid.label} />
                      ))}
                    </RadioGroup>
                    <DatePickerBox
                      t={t}
                      disabled={expiredRadioMap[Dict.MODULES.STATIC] !== customType ? true : false}
                      value={formParam.modules[Dict.MODULES.STATIC]?.expired || ''}
                      onChange={(newValue: Dayjs | string | null) => handleDatePickerChange(newValue as Dayjs, Dict.MODULES.STATIC)}
                    />
                  </Box>
                </Box>
              </Paper>
              <Paper elevation={0} className={`gray-box ${!currentModules[Dict.MODULES.UNIT] && 'hide'}`}>
                <Typography className="gray-box-title" variant="body2">
                  {t('unit-test')}
                </Typography>
                <Box className="form-line">
                  <Typography className="gray-box-label" variant="body2">
                    {t('case-report-extension')}
                  </Typography>
                  <Box>
                    <Box className="form-line">
                      <Typography className="extension-label" variant="body2">
                        {t('export')}
                      </Typography>
                      <FormGroup className="form-checkbox width-extension" row>
                        {unitCaseExportFormatList.map(extension => (
                          <FormControlLabel 
                            checked={formParam.modules && (formParam.modules[Dict.MODULES.UNIT] as any)[exportFormatKey].includes(extension.value)} 
                            key={`unit-exp-extension-${extension.value}`} 
                            control={<Checkbox 
                                        onChange={(event) => handleCaseFormatChange(event, Dict.MODULES.UNIT, exportFormatKey)}  
                                     />} 
                            value={extension.value} 
                            label={extension.label} 
                          />
                        ))}
                      </FormGroup>
                    </Box>
                    <Box className="form-line">
                      <Typography className="extension-label" variant="body2">
                        {t('import')}
                      </Typography>
                      <FormGroup className="form-checkbox width-extension" row>
                        {unitCaseImportFormatList.map(extension => (
                          <FormControlLabel 
                            checked={formParam.modules && (formParam.modules[Dict.MODULES.UNIT] as any)[importFormatKey].includes(extension.value)} 
                            key={`unit-imp-extension-${extension.value}`} 
                            control={<Checkbox 
                                        onChange={(event) => handleCaseFormatChange(event, Dict.MODULES.UNIT, importFormatKey)} 
                                      />} 
                            value={extension.value} 
                            label={extension.label} 
                          />
                        ))}
                      </FormGroup>
                    </Box>
                  </Box>
                </Box>
                <Box className="form-line">
                  <Typography className="gray-box-label" variant="body2">
                    {t('valid-date')}
                  </Typography>
                  <Box sx={{ display: 'flex' }}>
                    <RadioGroup
                      row
                      value={expiredRadioMap[Dict.MODULES.UNIT]}
                      onChange={(event) => handleExpiredRadioChange(event.target.value, Dict.MODULES.UNIT)}
                      className="form-radio width-valid-date"
                    >
                      {validDateList.map(valid => (
                        <FormControlLabel key={`unit-valid-${valid.value}`} control={<Radio size="small" />} value={valid.value} label={valid.label} />
                      ))}
                    </RadioGroup>
                    <DatePickerBox
                      t={t}
                      disabled={expiredRadioMap[Dict.MODULES.UNIT] !== customType ? true : false}
                      value={formParam.modules[Dict.MODULES.UNIT]?.expired || ''}
                      onChange={(newValue: Dayjs | string | null) => handleDatePickerChange(newValue as Dayjs, Dict.MODULES.UNIT)}
                    />
                  </Box>
                </Box>
              </Paper>
              <Paper elevation={0} className={`gray-box ${!currentModules[Dict.MODULES.INTEGRATE] && 'hide'}`}>
                <Typography className="gray-box-title" variant="body2">
                  {t('integrate-test')}
                </Typography>
                <Box className="form-line">
                  <Typography className="gray-box-label" variant="body2">
                    {t('case-report-extension')}
                  </Typography>
                  <Box>
                    <Box className="form-line">
                      <Typography className="extension-label" variant="body2">
                        {t('export')}
                      </Typography>
                      <FormGroup className="form-checkbox width-extension" row>
                        {integrationCaseExportFormatList.map(extension => (
                          <FormControlLabel 
                            checked={formParam.modules && (formParam.modules[Dict.MODULES.INTEGRATE] as any)[exportFormatKey].includes(extension.value)} 
                            key={`integrate-exp-extension-${extension.value}`} 
                            control={<Checkbox onChange={event => handleCaseFormatChange(event, Dict.MODULES.INTEGRATE, exportFormatKey)} />}
                            value={extension.value} 
                            label={extension.label} 
                          />
                        ))}
                      </FormGroup>
                    </Box>
                    <Box className="form-line">
                      <Typography className="extension-label" variant="body2">
                        {t('import')}
                      </Typography>
                      <FormGroup className="form-checkbox width-extension" row>
                        {integrationCaseImportFormatList.map(extension => (
                          <FormControlLabel 
                            checked={formParam.modules && (formParam.modules[Dict.MODULES.INTEGRATE] as any)[importFormatKey].includes(extension.value)} 
                            key={`integrate-imp-extension-${extension.value}`} 
                            control={<Checkbox onChange={event => handleCaseFormatChange(event, Dict.MODULES.INTEGRATE, importFormatKey)} />} 
                            value={extension.value} 
                            label={extension.label} 
                          />
                        ))}
                      </FormGroup>
                    </Box>
                  </Box>
                </Box>
                <Box className="form-line">
                  <Typography className="gray-box-label" variant="body2">
                    {t('valid-date')}
                  </Typography>
                  <Box sx={{ display: 'flex' }}>
                    <RadioGroup
                      row
                      value={expiredRadioMap[Dict.MODULES.INTEGRATE]}
                      onChange={(event) => handleExpiredRadioChange(event.target.value, Dict.MODULES.INTEGRATE)}
                      className="form-radio width-valid-date"
                    >
                      {validDateList.map(valid => (
                        <FormControlLabel key={`integrate-valid-${valid.value}`} control={<Radio size="small" />} value={valid.value} label={valid.label} />
                      ))}
                    </RadioGroup>
                    <DatePickerBox
                      t={t}
                      disabled={expiredRadioMap[Dict.MODULES.INTEGRATE] !== customType ? true : false}
                      value={formParam.modules[Dict.MODULES.INTEGRATE]?.expired || ''}
                      onChange={(newValue: Dayjs | string | null) => handleDatePickerChange(newValue as Dayjs, Dict.MODULES.INTEGRATE)}
                    />
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
          <Box className="form-line">
            <Typography className="form-line-label" variant="body2">
              {t('remark')}
            </Typography>
            <Box className="form-line-content">
              <textarea className="form-input" name="comment" defaultValue={formParam.comment || ''} onChange={event => handleFormDataChange(event)} placeholder={t('pls-ipt-remark')} />
            </Box>
          </Box>
        </form>
    }></BaseDialog>
  );
}