/*
 * RERO angular core
 * Copyright (C) 2020 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { EditorService } from '../editor.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Component for displaying an object in editor.
 */
@Component({
  selector: 'ng-core-editor-formly-object-type',
  templateUrl: './object-type.component.html'
})
export class ObjectTypeComponent extends FieldType {
  // default value
  defaultOptions = {
    defaultValue: {}
  };

  /**
   * Constructor
   * @param editorService - EditorService, that keep the list of hidden fields
   * @param _translateService - TranslateService, that translate the labels of the hidden fields
   */
  constructor(
    private _editorService: EditorService,
    private _translateService: TranslateService
  ) {
    super();
  }

  /**
   * Is the dropdown menu displayed?
   * @param field - FormlyFieldConfig, the correspondig form field config
   * @returns boolean, true if the menu should be displayed
   */
  hasMenu(field: FormlyFieldConfig) {
    return (
      (field.type === 'object' && this.hiddenFieldGroup(field.fieldGroup).length > 0) ||
      field.templateOptions.helpURL
    );
  }

  /**
   * Filter the fieldGroup to return the list of hidden field.
   * @param fieldGroup - FormlyFieldConfig[], the fieldGroup to filter
   * @returns FormlyFieldConfig[], the filtered list
   */
  hiddenFieldGroup(fieldGroup: FormlyFieldConfig[]): FormlyFieldConfig[] {
    return fieldGroup.filter(f => f.hide && f.hideExpression == null);
  }

  /**
   * Translate the label of a given formly field.
   *
   * @param field ngx-formly field
   */
  translateLabel(field: FormlyFieldConfig) {
    return this._translateService.stream(field.templateOptions.untranslatedLabel);
  }

  /**
   * Is my parent an array?
   * @returns boolean, true if my parent is an array
   */
  isParrentArray() {
    return this.field.parent.type === 'array';
  }

  /**
   * Am I at the root of the form?
   * @returns boolean, true if I'm the root
   */
  isRoot() {
    return this.field.parent.parent === undefined;
  }

  /**
   * Hide the field
   * @param field - FormlyFieldConfig, the field to hide
   */
  hide(field: FormlyFieldConfig) {
    field.formControl.reset();
    field.hide = true;
    if (this.isRoot()) {
      this._editorService.addHiddenField(field);
    }
  }

  /**
   * Show the field
   * @param field - FormlyFieldConfig, the field to show
   */
  show(field: FormlyFieldConfig) {
    field.hide = false;
  }

  /**
   * Is the field can be hidden?
   * @param field - FormlyFieldConfig, the field to hide
   * @returns boolean, true if the field can be hidden
   */
  canHide(field: FormlyFieldConfig) {
    if (!this.field.templateOptions.longMode) {
      return false;
    }
    return (
      field.type !== 'multischema' &&
      !field.templateOptions.required &&
      !field.hide &&
      field.hideExpression == null
    );
  }

  /**
   * Get css class declared in template options
   *
   * @param field field to apply css class to
   * @return css class to apply
   */
  getCssClass(field: FormlyFieldConfig = null): string {
    if (field !== null) {
      return field.templateOptions.cssClass;
    }
    const fieldGroup = this.field.fieldGroup;
    // formly jsonschema duplicate the object in the form hierarchy
    if (fieldGroup && fieldGroup.length === 1 && fieldGroup[0].type === 'multischema') {
      return '';
    }
    return this.to.cssClass;
  }
}
